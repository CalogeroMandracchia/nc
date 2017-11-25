const net = require('net');
const tls = require('tls');
const readline = require('readline');

//parameters
const listProtocols = {"tcp": new net.Socket(), "tls": new tls.TLSSocket()};
const [protocol="tcp", host, port=80, encoding="utf8"] = process.argv.slice(2);

//check parameters
if(net.isIP(host) == 0) throw new Error("ERR_INVALID_DOMAIN_NAME"); // Returns 0 for invalid strings, 4 for IPV4 and 6 for IPV6

//initialize
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const client = listProtocols[protocol].connect(port, host);
client.setEncoding(encoding); // 'hex', 'utf8'
client.setKeepAlive(true);

//listeners
const connected = () => 
{
    console.log('Origin: ' + client.localAddress + ':' + client.localPort);
    console.log('Destination: ' + client.remoteAddress + ':' + client.remotePort);
    console.log('Family: ' + client.remoteFamily);
    console.log('Protocol: ' + protocol.toUpperCase()); 
    console.log('Encoding: ' + encoding); 
    console.log();
}
client.on('connect', connected); // Emitted when a socket connection is successfully established.
const closed = (had_error) =>
{
    console.log('Connection closed');
    rl.close();
    client.destroy();
}
client.on('close', closed); // had_error==true if the socket was closed due to a transmission error.
client.on('end', () => {console.log('Connection end'); }); // Emitted when the other end of the socket sends a FIN packet
client.on('error', (error) => {console.log(error); }); // Emitted when an error occurs
client.on('timeout', () => {console.log('Connection timeout'); }); // This is only to notify that the socket has been idle

//receiving data
const received = (data) =>
{
    //console.log('bytesRead: ' + client.bytesRead); // The amount of received bytes.
    //console.log('bytesWritten: ' + client.bytesWritten) // The amount of bytes sent.
    console.log(data); // The argument data will be a Buffer or String
}
client.on('data', received);

//sending data
const send = (data) => { const res = client.write(data + "\n", encoding); if(!res) throw new Error("socke.write didn't flush") } // Returns true if the entire data was flushed successfully to the kernel buffer
rl.on('line', (input) => send(input));

//closing
rl.on('SIGINT', closed);