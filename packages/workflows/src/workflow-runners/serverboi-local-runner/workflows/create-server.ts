import { PostProvision, PostProvisionInput } from "../../../steps/create-server/post-provision";
import { ProvisionServer } from "../../../steps/create-server/provision-server";
import { WaitForConnectivity, WaitForConnectivityInput } from "../../../steps/create-server/wait-for-connectivity";
import { CreateServerWorkflowInput } from "../../../workflows/create-server";
import { ServerBoiLocalRunnerContext } from "../context";

export async function CreateServerWorkflow(input: CreateServerWorkflowInput, context: ServerBoiLocalRunnerContext) {

  // steps
  // const context = {}

  // // provision
  // /// form input
  context.changeStep("provision")
  const provisionOutput = await ProvisionServer(input)

  // // wait for connectivity
  context.changeStep("wait-for-connectivity")
  const waitInput: WaitForConnectivityInput = {
    identifier: provisionOutput.identifier,
    location: provisionOutput.location,
    templateOptions: input.templateOptions,
    applicationHealthCheck: input.applicationTemplate.healthCheck,
    providerData: input.providerData,
  }

  let ipAddress: string | undefined = undefined
  let queryPort: number | undefined = undefined
  while (true) {
    const waitResponse = await WaitForConnectivity(waitInput)
    if (waitResponse.connectivity) {
      ipAddress = waitResponse.ipAddress
      queryPort = waitResponse.port
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 50000))
  }


  context.changeStep("post-provision")
  // // register server
  const postProvisionInput: PostProvisionInput = {
    serverId: input.serverId,
    identifier: provisionOutput.identifier,
    location: provisionOutput.location,
    name: input.serverOptions.name,
    address: ipAddress!,
    queryPort: queryPort!,
    user: input.user,
    providerData: input.providerData,
    templateOptions: input.templateOptions,
    applicationTemplate: input.applicationTemplate,
    persistenceCfg: input.persistenceCfg,
  }
  const registerResponse = await PostProvision(postProvisionInput, context)

  return {}
}