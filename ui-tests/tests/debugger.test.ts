// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { describe, galata, test } from '@jupyterlab/galata';

jest.setTimeout(60000);

describe('Debugger Tests', () => {
  beforeAll(async () => {
    await galata.resetUI();
    galata.context.capturePrefix = 'debugger';
  });

  afterAll(async () => {
    galata.context.capturePrefix = '';
  });

  test('Move Debugger to right', async () => {
    await galata.sidebar.moveTabToRight('jp-debugger-sidebar');
    expect(await galata.sidebar.getTabPosition('jp-debugger-sidebar')).toBe(
      'right'
    );
  });

  test('Open Debugger on right', async () => {
    await galata.sidebar.openTab('jp-debugger-sidebar');
    expect(await galata.sidebar.isTabOpen('jp-debugger-sidebar')).toBeTruthy();
  });
});
