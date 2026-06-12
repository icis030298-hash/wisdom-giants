import { google } from "googleapis";
import path from "path";

async function main() {
  console.log("Initializing Auth...");
  const keyPath = path.resolve(process.cwd(), "google-service-account.json");
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const crm = google.cloudresourcemanager({
    version: "v1",
    auth,
  });

  const projectId = "giantswisdom-8dc26";
  const member = "serviceAccount:seo-giantswisdom@giantswisdom-8dc26.iam.gserviceaccount.com";

  console.log(`Getting IAM Policy for project ${projectId}...`);
  try {
    const policyRes = await crm.projects.getIamPolicy({
      resource: projectId,
    });
    const policy = policyRes.data;
    console.log("IAM Policy retrieved successfully.");

    const roleToGrant = "roles/aiplatform.user";
    let binding = policy.bindings?.find(b => b.role === roleToGrant);
    if (!binding) {
      binding = { role: roleToGrant, members: [] };
      if (!policy.bindings) policy.bindings = [];
      policy.bindings.push(binding);
    }

    if (!binding.members?.includes(member)) {
      binding.members = binding.members || [];
      binding.members.push(member);
      console.log(`Adding ${member} to ${roleToGrant}...`);

      await crm.projects.setIamPolicy({
        resource: projectId,
        requestBody: {
          policy,
        },
      });
      console.log("IAM Policy updated successfully! Vertex AI User role granted.");
    } else {
      console.log("Service account already possesses the Vertex AI User role.");
    }
  } catch (e: any) {
    console.error("Error managing IAM Policy:", e.message || e);
  }
}

main().catch(console.error);
