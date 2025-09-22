import { ExecutionEnviornment } from "@/lib/types";
import { AWSS3Task } from "../../task/AWSS3";
import { getCredentialValue } from "@/lib/credential-helper";

export async function UploadExecutor(
  enviornment: ExecutionEnviornment<typeof AWSS3Task>
): Promise<boolean> {
  try {
    const bucket = enviornment.getInput("Bucket");
    const key = enviornment.getInput("Key");
    const content = enviornment.getInput("Content");
    const credentialId = enviornment.getInput("Credentials");

    if (!bucket || !key || !content) {
      enviornment.log.error("Bucket, Key, and Content are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("AWS credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_key_id || !credentials.secret_access_key) {
      enviornment.log.error("Invalid AWS credentials - access_key_id and secret_access_key required");
      return false;
    }

    // Use AWS SDK v3 style API call
    const region = credentials.region || 'us-east-1';
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `AWS4-HMAC-SHA256 Credential=${credentials.access_key_id}`,
        'Content-Type': 'text/plain',
        'x-amz-date': new Date().toISOString().replace(/[:\-]|\.\d{3}/g, ''),
      },
      body: content,
    });

    if (!response.ok) {
      throw new Error(`S3 upload failed: ${response.statusText}`);
    }

    enviornment.setOutput("URL", url);
    enviornment.log.info(`File uploaded to S3: ${key}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}