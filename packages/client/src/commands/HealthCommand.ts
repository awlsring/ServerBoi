import {
  ServerBoiClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../ServerBoiClient";
import { getHttpApiKeyAuthPlugin } from "../middleware/HttpApiKeyAuth";
import { HealthOutput } from "../models/models_0";
import {
  deserializeAws_restJson1HealthCommand,
  serializeAws_restJson1HealthCommand,
} from "../protocols/Aws_restJson1";
import { getSerdePlugin } from "@aws-sdk/middleware-serde";
import {
  HttpRequest as __HttpRequest,
  HttpResponse as __HttpResponse,
} from "@aws-sdk/protocol-http";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  FinalizeHandlerArguments,
  Handler,
  HandlerExecutionContext,
  MiddlewareStack,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  SerdeContext as __SerdeContext,
} from "@aws-sdk/types";

export interface HealthCommandInput {}
export interface HealthCommandOutput extends HealthOutput, __MetadataBearer {}

export class HealthCommand extends $Command<HealthCommandInput, HealthCommandOutput, ServerBoiClientResolvedConfig> {
  // Start section: command_properties
  // End section: command_properties

  constructor(readonly input: HealthCommandInput) {
    // Start section: command_constructor
    super();
    // End section: command_constructor
  }

  /**
   * @internal
   */
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: ServerBoiClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<HealthCommandInput, HealthCommandOutput> {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getHttpApiKeyAuthPlugin(configuration, { scheme: 'ApiKey', in: 'header', name: 'Authorization'}));

    const stack = clientStack.concat(this.middlewareStack);

    const { logger } = configuration;
    const clientName = "ServerBoiClient";
    const commandName = "HealthCommand";
    const handlerExecutionContext: HandlerExecutionContext = {
      logger,
      clientName,
      commandName,
      inputFilterSensitiveLog:
        (input: any) => input,
      outputFilterSensitiveLog:
        HealthOutput.filterSensitiveLog,
    }
    const { requestHandler } = configuration;
    return stack.resolve(
      (request: FinalizeHandlerArguments<any>) =>
        requestHandler.handle(request.request as __HttpRequest, options || {}),
      handlerExecutionContext
    );
  }

  private serialize(
    input: HealthCommandInput,
    context: __SerdeContext
  ): Promise<__HttpRequest> {
    return serializeAws_restJson1HealthCommand(input, context);
  }

  private deserialize(
    output: __HttpResponse,
    context: __SerdeContext
  ): Promise<HealthCommandOutput> {
    return deserializeAws_restJson1HealthCommand(output, context);
  }

  // Start section: command_body_extra
  // End section: command_body_extra
}
