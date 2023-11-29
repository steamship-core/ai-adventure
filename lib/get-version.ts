export const getVersion = (agentVersion: string) => {
  const versionParts = agentVersion.split(/\.|-/);
  const len = versionParts.length;
  if (len < 2) {
    const major = parseInt(versionParts[0]);
    const minor = parseInt(versionParts[1]);
    return {
      major,
      minor,
      patch: 0,
      raw: agentVersion,
      base: `${major}.${minor}`,
    };
  }

  const major = parseInt(versionParts[0]);
  const minor = parseInt(versionParts[1]);
  const patch = parseInt(versionParts[2]);
  return {
    major,
    minor,
    patch,
    raw: agentVersion,
    base: `${major}.${minor}.${patch}`,
  };
};
