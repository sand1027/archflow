import { ExecutionEnviornment } from "@/lib/types";
import { AWSS3Task } from "../../task/AWSS3";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ListExecutor(
  enviornment: ExecutionEnviornment<typeof AWSS3Task>
): Promise<boolean> {
  try {
    const bucket = enviornment.getInput("Bucket");
    const credentialId = enviornment.getInput("Credentials");

    if (!bucket) {
      enviornment.log.error("Bucket is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("AWS credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_key_id || !credentials.secret_access_key) {
      enviornment.log.error("Invalid AWS credentials");
      return false;
    }

    const region = credentials.region || 'us-east-1';
    const url = `https://${bucket}.s3.${region}.amazonaws.com/`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `AWS4-HMAC-SHA256 Credential=${credentials.access_key_id}`,
        'x-amz-date': new Date().toISOString().replace(/[:\-]|\.\d{3}/g, ''),
      },
    });

    if (!response.ok) {
      throw new Error(`S3 list failed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    // Parse XML response to extract file names (simplified)
    const files = xmlText.match(/<Key>([^<]+)<\/Key>/g)?.map(match => ({
      name: match.replace(/<\/?Key>/g, ''),
      url: `https://${bucket}.s3.${region}.amazonaws.com/${match.replace(/<\/?Key>/g, '')}`
    })) || [];

    enviornment.setOutput("Files", JSON.stringify(files));
    enviornment.log.info(`Listed ${files.length} files in bucket: ${bucket}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}