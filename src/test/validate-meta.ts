
export const validateMeta = (t, meta, parenName) => {
  if(!meta) return;

  t.truthy(meta.buff, 'meta must have a buff' + parenName);
  t.true(meta.buffValue > 0, 'meta must have a value > 0' + parenName);
  t.true(meta.priority > 0 && meta.priority < 5, 'meta must have a priority 1..4' + parenName);

  t.falsy(meta.source, 'meta source should not be set' + parenName);
  t.falsy(meta.sourceCharacter, 'meta sourceCharacter should not be set' + parenName);
  t.falsy(meta.sourceImage, 'meta sourceImage should not be set' + parenName);
};