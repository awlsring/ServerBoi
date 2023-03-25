import { ServerBoiClient } from "./ServerBoiClient";
import {
  GetServerCommand,
  GetServerCommandInput,
  GetServerCommandOutput,
} from "./commands/GetServerCommand";
import {
  HealthCommand,
  HealthCommandInput,
  HealthCommandOutput,
} from "./commands/HealthCommand";
import {
  ListServersCommand,
  ListServersCommandInput,
  ListServersCommandOutput,
} from "./commands/ListServersCommand";
import {
  TrackServerCommand,
  TrackServerCommandInput,
  TrackServerCommandOutput,
} from "./commands/TrackServerCommand";
import {
  UntrackServerCommand,
  UntrackServerCommandInput,
  UntrackServerCommandOutput,
} from "./commands/UntrackServerCommand";
import {
  UpdateServerCommand,
  UpdateServerCommandInput,
  UpdateServerCommandOutput,
} from "./commands/UpdateServerCommand";
import { HttpHandlerOptions as __HttpHandlerOptions } from "@aws-sdk/types";

export class ServerBoi extends ServerBoiClient {
  public getServer(
    args: GetServerCommandInput,
    options?: __HttpHandlerOptions,
  ): Promise<GetServerCommandOutput>;
  public getServer(
    args: GetServerCommandInput,
    cb: (err: any, data?: GetServerCommandOutput) => void
  ): void;
  public getServer(
    args: GetServerCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: GetServerCommandOutput) => void
  ): void;
  public getServer(
    args: GetServerCommandInput,
    optionsOrCb?: __HttpHandlerOptions | ((err: any, data?: GetServerCommandOutput) => void),
    cb?: (err: any, data?: GetServerCommandOutput) => void
  ): Promise<GetServerCommandOutput> | void {
    const command = new GetServerCommand(args);
    if (typeof optionsOrCb === "function") {
      this.send(command, optionsOrCb)
    } else if (typeof cb === "function") {
      if (typeof optionsOrCb !== "object")
        throw new Error(`Expect http options but get ${typeof optionsOrCb}`)
      this.send(command, optionsOrCb || {}, cb)
    } else {
      return this.send(command, optionsOrCb);
    }
  }

  public health(
    args: HealthCommandInput,
    options?: __HttpHandlerOptions,
  ): Promise<HealthCommandOutput>;
  public health(
    args: HealthCommandInput,
    cb: (err: any, data?: HealthCommandOutput) => void
  ): void;
  public health(
    args: HealthCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: HealthCommandOutput) => void
  ): void;
  public health(
    args: HealthCommandInput,
    optionsOrCb?: __HttpHandlerOptions | ((err: any, data?: HealthCommandOutput) => void),
    cb?: (err: any, data?: HealthCommandOutput) => void
  ): Promise<HealthCommandOutput> | void {
    const command = new HealthCommand(args);
    if (typeof optionsOrCb === "function") {
      this.send(command, optionsOrCb)
    } else if (typeof cb === "function") {
      if (typeof optionsOrCb !== "object")
        throw new Error(`Expect http options but get ${typeof optionsOrCb}`)
      this.send(command, optionsOrCb || {}, cb)
    } else {
      return this.send(command, optionsOrCb);
    }
  }

  public listServers(
    args: ListServersCommandInput,
    options?: __HttpHandlerOptions,
  ): Promise<ListServersCommandOutput>;
  public listServers(
    args: ListServersCommandInput,
    cb: (err: any, data?: ListServersCommandOutput) => void
  ): void;
  public listServers(
    args: ListServersCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: ListServersCommandOutput) => void
  ): void;
  public listServers(
    args: ListServersCommandInput,
    optionsOrCb?: __HttpHandlerOptions | ((err: any, data?: ListServersCommandOutput) => void),
    cb?: (err: any, data?: ListServersCommandOutput) => void
  ): Promise<ListServersCommandOutput> | void {
    const command = new ListServersCommand(args);
    if (typeof optionsOrCb === "function") {
      this.send(command, optionsOrCb)
    } else if (typeof cb === "function") {
      if (typeof optionsOrCb !== "object")
        throw new Error(`Expect http options but get ${typeof optionsOrCb}`)
      this.send(command, optionsOrCb || {}, cb)
    } else {
      return this.send(command, optionsOrCb);
    }
  }

  public trackServer(
    args: TrackServerCommandInput,
    options?: __HttpHandlerOptions,
  ): Promise<TrackServerCommandOutput>;
  public trackServer(
    args: TrackServerCommandInput,
    cb: (err: any, data?: TrackServerCommandOutput) => void
  ): void;
  public trackServer(
    args: TrackServerCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: TrackServerCommandOutput) => void
  ): void;
  public trackServer(
    args: TrackServerCommandInput,
    optionsOrCb?: __HttpHandlerOptions | ((err: any, data?: TrackServerCommandOutput) => void),
    cb?: (err: any, data?: TrackServerCommandOutput) => void
  ): Promise<TrackServerCommandOutput> | void {
    const command = new TrackServerCommand(args);
    if (typeof optionsOrCb === "function") {
      this.send(command, optionsOrCb)
    } else if (typeof cb === "function") {
      if (typeof optionsOrCb !== "object")
        throw new Error(`Expect http options but get ${typeof optionsOrCb}`)
      this.send(command, optionsOrCb || {}, cb)
    } else {
      return this.send(command, optionsOrCb);
    }
  }

  public untrackServer(
    args: UntrackServerCommandInput,
    options?: __HttpHandlerOptions,
  ): Promise<UntrackServerCommandOutput>;
  public untrackServer(
    args: UntrackServerCommandInput,
    cb: (err: any, data?: UntrackServerCommandOutput) => void
  ): void;
  public untrackServer(
    args: UntrackServerCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UntrackServerCommandOutput) => void
  ): void;
  public untrackServer(
    args: UntrackServerCommandInput,
    optionsOrCb?: __HttpHandlerOptions | ((err: any, data?: UntrackServerCommandOutput) => void),
    cb?: (err: any, data?: UntrackServerCommandOutput) => void
  ): Promise<UntrackServerCommandOutput> | void {
    const command = new UntrackServerCommand(args);
    if (typeof optionsOrCb === "function") {
      this.send(command, optionsOrCb)
    } else if (typeof cb === "function") {
      if (typeof optionsOrCb !== "object")
        throw new Error(`Expect http options but get ${typeof optionsOrCb}`)
      this.send(command, optionsOrCb || {}, cb)
    } else {
      return this.send(command, optionsOrCb);
    }
  }

  public updateServer(
    args: UpdateServerCommandInput,
    options?: __HttpHandlerOptions,
  ): Promise<UpdateServerCommandOutput>;
  public updateServer(
    args: UpdateServerCommandInput,
    cb: (err: any, data?: UpdateServerCommandOutput) => void
  ): void;
  public updateServer(
    args: UpdateServerCommandInput,
    options: __HttpHandlerOptions,
    cb: (err: any, data?: UpdateServerCommandOutput) => void
  ): void;
  public updateServer(
    args: UpdateServerCommandInput,
    optionsOrCb?: __HttpHandlerOptions | ((err: any, data?: UpdateServerCommandOutput) => void),
    cb?: (err: any, data?: UpdateServerCommandOutput) => void
  ): Promise<UpdateServerCommandOutput> | void {
    const command = new UpdateServerCommand(args);
    if (typeof optionsOrCb === "function") {
      this.send(command, optionsOrCb)
    } else if (typeof cb === "function") {
      if (typeof optionsOrCb !== "object")
        throw new Error(`Expect http options but get ${typeof optionsOrCb}`)
      this.send(command, optionsOrCb || {}, cb)
    } else {
      return this.send(command, optionsOrCb);
    }
  }

}
