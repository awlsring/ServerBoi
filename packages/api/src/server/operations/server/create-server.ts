import { Operation } from "@aws-smithy/server-common";
import { InternalServerError, CreateServerServerInput, CreateServerServerOutput } from "@serverboi/ssdk";
import { ServiceContext } from "../../handler/context";
import { logger } from "@serverboi/common";

const log = logger.child({ name: "CreateServerOperation" });

export const CreateServerOperation: Operation<CreateServerServerInput, CreateServerServerOutput, ServiceContext> = async (input, context) => {
  try {
    log.debug(`Received CreateServer operation`);
    log.debug(`Input: ${JSON.stringify(input)}`);

    log.debug(`Starting server creation workflow`)
    const execution = await context.controller.execution.runCreateServerExecution({
      scope: input.scope!,
      user: context.user,
      name: input.name!,
      application: input.application!,
      capabilities: input.capabilities!,
      provider: {
        provider: input.providerOptions!.provider!,
        location: input.providerOptions!.location,
        data: input.providerOptions!.data,
      },
      template: {
        variables: input.templateOptions!.variables?.map(v => ({ name: v.name!, value: v.value! })) ?? [],
        ports: input.templateOptions!.ports?.map(p => ({ host: p.host!, container: p.container! })) ?? []
      }
    });

    return {
      executionId: execution.id,
    }
  } catch (e) {
    log.error(e);
    throw new InternalServerError({ message: `Error starting server creation workflow: ${e}`} );
  }
};