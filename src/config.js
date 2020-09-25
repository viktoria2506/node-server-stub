const host   = process.env.host || 'localhost';
const port   = process.env.port || 1337;
const config = { host, port };

export { host, port, config };
export default config;
