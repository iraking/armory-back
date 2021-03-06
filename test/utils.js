// eslint-disable-next-line
export const stubValidator = ({ addResource, addRule, validate }) => {
  const module = () => ({ validate });

  // eslint-disable-next-line
  module.addResource = addResource.returns(module);
  // eslint-disable-next-line
  module.addRule = addRule.returns(module);

  return {
    'gotta-validate': module,
  };
};
