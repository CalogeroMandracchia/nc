# nc
vanilla minimalist netcat written in ES6

use:


node nc protocol host port [encoding]



protocol = TCP - TLS


host = IPV4 - IPV6


encoding = 'hex' - 'utf8' - 'binary' - 'ascii', ... ( all node.js encodings )



example



node nc tcp 127.0.0.1 8000


node nc tls 127.0.0.1 443 hex
