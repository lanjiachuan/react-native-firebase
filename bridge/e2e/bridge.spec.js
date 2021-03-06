const should = require('should');

describe('bridge', () => {
  beforeEach(async function beforeEach() {
    // await device.reloadReactNative();
    bridge.root.setState({ message: this.currentTest.title });
  });

  it('should provide -> global.bridge', () => {
    should(bridge).not.be.undefined();
    return Promise.resolve();
  });

  // main react-native module you're testing on
  // in our case react-native-firebase
  it('should provide -> bridge.module', () => {
    should(bridge.module).not.be.undefined();
    return Promise.resolve();
  });

  // react-native module access
  it('should provide -> bridge.rn', () => {
    should(bridge.rn).not.be.undefined();
    should(bridge.rn.Platform.OS).be.a.String();
    should(bridge.rn.Platform.OS).equal(device.getPlatform());
    return Promise.resolve();
  });

  // 'global' context of the app's JS environment
  it('should provide -> bridge.context', () => {
    should(bridge.context).not.be.undefined();
    should(bridge.context.setTimeout).be.a.Function();
    should(bridge.context.window).be.a.Object();
    // etc ... e.g. __coverage__ is here also if covering
    return Promise.resolve();
  });

  // the apps root component
  // allows you to read and set state if required
  it('should provide -> bridge.root', async () => {
    should(bridge.root).not.be.undefined();
    should(bridge.root.setState).be.a.Function();
    should(bridge.root.state).be.a.Object();

    // test setting state
    await new Promise(resolve =>
      bridge.root.setState({ message: 'hello world' }, resolve)
    );
    should(bridge.root.state.message).equal('hello world');
    return Promise.resolve();
  });

  // we shim our own reloadReactNative functionality as the detox reloadReactNative built-in
  // hangs often and seems unpredictable - todo: investigate & PR if solution found
  // reloadReactNative is replaced on init with bridge.root automatically
  it('should allow reloadReactNative usage without breaking remote debug', async () => {
    should(bridge.reload).be.a.Function();
    // and check it works without breaking anything
    await device.reloadReactNative();
    should(bridge.reload).be.a.Function();
    return Promise.resolve();
  });

  it('should allow launchApp usage without breaking remote debug', async () => {
    should(bridge.module).not.be.undefined();
    should(bridge.reload).be.a.Function();
    should(bridge.rn).not.be.undefined();
    should(bridge.rn.Platform.OS).be.a.String();
    should(bridge.rn.Platform.OS).equal(device.getPlatform());

    await device.launchApp({ newInstance: true });

    should(bridge.module).not.be.undefined();
    should(bridge.reload).be.a.Function();
    should(bridge.rn).not.be.undefined();
    should(bridge.rn.Platform.OS).be.a.String();
    should(bridge.rn.Platform.OS).equal(device.getPlatform());
    return Promise.resolve();
  });
});
