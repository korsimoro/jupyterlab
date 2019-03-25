// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { DataConnector, URLExt } from '@jupyterlab/coreutils';

import { ReadonlyJSONObject } from '@phosphor/coreutils';

import { ServerConnection } from '../serverconnection';

/**
 * The url for the lab workspaces service.
 */
const SERVICE_WORKSPACES_URL = 'api/workspaces';
async function logError(response: any) {
  console.log('RESPONSE:', response);
  console.log('TEXT:', await response.text());
}

/**
 * The workspaces API service manager.
 */
export class WorkspaceManager extends DataConnector<Workspace.IWorkspace> {
  /**
   * Create a new workspace manager.
   */
  constructor(options: WorkspaceManager.IOptions = {}) {
    super();
    this.serverSettings =
      options.serverSettings || ServerConnection.makeSettings();
  }

  /**
   * The server settings used to make API requests.
   */
  readonly serverSettings: ServerConnection.ISettings;

  /**
   * Fetch a workspace.
   *
   * @param id - The workspaces's ID.
   *
   * @returns A promise that resolves if successful.
   */
  async fetch(id: string): Promise<Workspace.IWorkspace> {
    const { serverSettings } = this;
    const { baseUrl, pageUrl } = serverSettings;
    const { makeRequest, ResponseError } = ServerConnection;
    const base = baseUrl + pageUrl;
    const url = Private.url(base, id);
    console.log(`FETCH WORKSPACE ${id}, url=${url}`);
    const response = await makeRequest(url, {}, serverSettings);

    if (response.status !== 200) {
      await logError(response);
      throw new ResponseError(response);
    }

    return response.json();
  }

  /**
   * Fetch the list of workspace IDs that exist on the server.
   *
   * @returns A promise that resolves if successful.
   */
  async list(): Promise<{ ids: string[]; values: Workspace.IWorkspace[] }> {
    const { serverSettings } = this;
    const { baseUrl, pageUrl } = serverSettings;
    const { makeRequest, ResponseError } = ServerConnection;
    const base = baseUrl + pageUrl;
    const url = Private.url(base, '');
    console.log(`LIST WORKSPACES url=${url}`);
    const response = await makeRequest(url, {}, serverSettings);

    if (response.status !== 200) {
      await logError(response);
      throw new ResponseError(response);
    }

    const result = await response.json();

    return result.workspaces;
  }

  /**
   * Remove a workspace from the server.
   *
   * @param id - The workspaces's ID.
   *
   * @returns A promise that resolves if successful.
   */
  async remove(id: string): Promise<void> {
    const { serverSettings } = this;
    const { baseUrl, pageUrl } = serverSettings;
    const { makeRequest, ResponseError } = ServerConnection;
    const base = baseUrl + pageUrl;
    const url = Private.url(base, id);
    console.log(`DELETE WORKSPACE ${id}, url=${url}`);
    const init = { method: 'DELETE' };
    const response = await makeRequest(url, init, serverSettings);

    if (response.status !== 204) {
      await logError(response);
      throw new ResponseError(response);
    }
  }

  /**
   * Save a workspace.
   *
   * @param id - The workspace's ID.
   *
   * @param workspace - The workspace being saved.
   *
   * @returns A promise that resolves if successful.
   */
  async save(id: string, workspace: Workspace.IWorkspace): Promise<void> {
    const { serverSettings } = this;
    const { baseUrl, pageUrl } = serverSettings;
    const { makeRequest, ResponseError } = ServerConnection;
    const base = baseUrl + pageUrl;
    const url = Private.url(base, id);
    console.log(
      `SAVE (PUT) WORKSPACE ${id}, url=${url}, workspace=`,
      workspace
    );
    const init = { body: JSON.stringify(workspace), method: 'PUT' };
    const response = await makeRequest(url, init, serverSettings);

    if (response.status !== 204) {
      await logError(response);
      throw new ResponseError(response);
    }
  }
}

/**
 * A namespace for `WorkspaceManager` statics.
 */
export namespace WorkspaceManager {
  /**
   * The instantiation options for a workspace manager.
   */
  export interface IOptions {
    /**
     * The server settings used to make API requests.
     */
    serverSettings?: ServerConnection.ISettings;
  }
}

/**
 * A namespace for workspace API interfaces.
 */
export namespace Workspace {
  /**
   * The interface for the workspace API manager.
   */
  export interface IManager extends WorkspaceManager {}

  /**
   * The interface describing a workspace API response.
   */
  export interface IWorkspace {
    /**
     * The workspace data.
     */
    data: ReadonlyJSONObject;

    /**
     * The metadata for a workspace.
     */
    metadata: {
      /**
       * The workspace ID.
       */
      id: string;
    };
  }
}

/**
 * A namespace for private data.
 */
namespace Private {
  /**
   * Get the url for a workspace.
   */
  export function url(base: string, id: string): string {
    return URLExt.join(base, SERVICE_WORKSPACES_URL, id);
  }
}
