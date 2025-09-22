import { ExecutionEnviornment } from "@/lib/types";
import { AWSS3Task } from "../../task/AWSS3";
import { getCredentialValue } from "@/lib/credential-helper";

export async function DownloadExecutor(
  enviornment: ExecutionEnviornment<typeof AWSS3Task>
): Promise<boolean> {
  try {
    const bucket = enviornment.getInput("Bucket");
    const key = enviornment.getInput("Key");
    const credentialId = enviornment.getInput("Credentials");

    if (!bucket || !key) {
      enviornment.log.error("Bucket and Key are required");
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
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `AWS4-HMAC-SHA256 Credential=${credentials.access_key_id}`,
        'x-amz-date': new Date().toISOString().replace(/[:\-]|\.\d{3}/g, ''),
      },
    });

    if (!response.ok) {
      throw new Error(`S3 download failed: ${response.statusText}`);
    }

    const content = await response.text();
    enviornment.setOutput("Content", content);
    enviornment.setOutput("URL", url);
    enviornment.log.info(`File downloaded from S3: ${key}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}