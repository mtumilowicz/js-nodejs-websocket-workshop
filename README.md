# js-nodejs-websocket

* https://tools.ietf.org/html/rfc6455
* https://www.ably.io/concepts/long-polling
* https://www.amazon.com/WebSocket-Client-Server-Communications-Andrew-Lombardi-ebook/dp/B015D78JVQ
* https://github.com/mtumilowicz/js-nodejs-websocket-echo-server
* https://github.com/mtumilowicz/js-nodejs-websocket-stock-server
* https://github.com/mtumilowicz/js-nodejs-websocket-chat

# introduction
* WebSocket is:
    * an event-driven, 
    * full-duplex (both directions) 
    * asynchronous 
    * communications channel
* is an independent TCP-based protocol
    * single TCP connection for traffic in both directions
* once the WebSocket handshake is finished, only the WebSocket protocol is used, not HTTP anymore
    * only relationship to HTTP is that its handshake is interpreted by HTTP servers as an Upgrade request
* By default, the WebSocket Protocol uses port 80 for regular WebSocket connections and port 443 for 
    WebSocket connections tunneled over Transport Layer Security (TLS)
* supports text and binary data
* provides real-time updates without hacks (like long pooling, http2 push notifications, etc.)
    * long polling
        1. server holds the request open
        1. waiting for state change (new data emerges)
        1. push response to the client
        1. when client receives response - it immediately sends another request and whole process repeats
        * main drawback: is not scalable: to maintain the session state for a given client, that state must either:
            * be sharable among all servers behind a load balancer – significant architectural complexity
            * or subsequent client requests within the same session must be routed to the same server to 
            which their original  request was processed - contradiction of load-balancing
    * http2 push notifications - TODO
    
# Opening Handshake

## overview
* WebSocket client's handshake is an HTTP Upgrade request
    ```
    GET ws://localhost:8080/ HTTP/1.1
    Host: localhost:8080
    Connection: Upgrade
    Pragma: no-cache
    Cache-Control: no-cache
    Upgrade: websocket
    Origin: http://localhost:63342
    Sec-WebSocket-Version: 13
    User-Agent: Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36
    Accept-Encoding: gzip, deflate, br
    Accept-Language: en,pl;q=0.9,en-US;q=0.8,pt;q=0.7
    Sec-WebSocket-Key: YTDTk0Cm9vtHE0HBnho4/Q==
    Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
    ```
* |Sec-WebSocket-Protocol| 
* server selects one or none of the acceptable protocols and echoes
     that value in its handshake to indicate that it has selected that
     protocol
* the server has to prove to the client that it received the
     client's WebSocket handshake, so that the server doesn't accept
     connections that are not WebSocket connections
    * This prevents an
     attacker from tricking a WebSocket server by sending it carefully
     crafted packets using XMLHttpRequest or a form
     submission
* To prove that the handshake was received, the server has to take two
     pieces of information and combine them to form a response
     ```
     HTTP/1.1 101 Switching Protocols
     Upgrade: websocket
     Connection: Upgrade
     Sec-WebSocket-Accept: lRpQzaMfn9PshDM89sErE1GVs2s=
     ```
    * The first
         piece of information comes from the |Sec-WebSocket-Key| header field
        * the server has to take the value (as present
             in the header field, e.g., the base64-encoded version minus
             any leading and trailing whitespace) and concatenate this with the
             Globally Unique Identifier (GUID)
        * "dGhlIHNhbXBsZSBub25jZQ==", the server
             would concatenate the string "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
             to form the string "dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-
             C5AB0DC85B11"
        * SHA-1 hash of this then base64-encoded "s3pPLMBiTxaQ9kYGzzhZRbK+xOo="  
        * This value would then be echoed in
             the |Sec-WebSocket-Accept| header field
        * |Sec-WebSocket-Accept| header field indicates whether
             the server is willing to accept the connection
    * HTTP/1.1 101 Switching Protocols
## details
* To _Establish a WebSocket Connection_, a client opens a connection
     and sends a handshake as defined in this section. 
* A connection is defined to initially be in a CONNECTING state.
* A client will need to
     supply a /host/, /port/, /resource name/, and a /secure/ flag, which
     are the components of a WebSocket URI as discussed in Section 3,
     along with a list of /protocols/ and /extensions/ to be used
     * Additionally, if the client is a web browser, it supplies /origin/
* denial-of-service attack by just opening a large number of WebSocket connections to a remote host
    * A server can further reduce the load on itself when attacked by pausing before closing the connection
    * There is no limit to the number of established WebSocket
             connections a client can have with a single remote host
    * Servers can refuse to accept connections from hosts/IP addresses with an
             excessive number of existing connections or disconnect resource-
             hogging connections when suffering high load
*  If /secure/ is true, the client MUST perform a TLS handshake over
         the connection after opening the connection and before sending
         the handshake data
    * all further communication on this channel MUST run through the
             encrypted tunnel
* Once a connection to the server has been established (including a
     connection via a proxy or over a TLS-encrypted tunnel), the client 
     MUST send an opening handshake to the server
    * The handshake consists
         of an HTTP Upgrade request, along with a list of required and
         optional header fields
        * The handshake MUST be a valid HTTP request
        * the method of the request MUST be GET, and the HTTP version MUST be at least 1.1
        * The request MUST contain an |Upgrade| header field whose value MUST include the "websocket" keyword
        * The request MUST contain a |Connection| header field whose value MUST include the "Upgrade" token
        * The request MUST include a header field with the name |Sec-WebSocket-Key|
            * random numbers selected randomly for each connection
        * The request MUST include a header field with the name |Origin| if the request is coming from a browser client
        *  The request MUST include a header field with the name
                  |Sec-WebSocket-Version|.  The value of this header field MUST be
                  13
        * The request MAY include a header field with the name
                  |Sec-WebSocket-Protocol|.  If present, this value indicates one
                  or more comma-separated subprotocol the client wishes to speak,
                  ordered by preference
        * The request MAY include any other header fields, for example,
                  cookies and/or authentication-related header fields
                  such as the |Authorization| header field, which are
                  processed according to documents that define them
* Once the client's opening handshake has been sent, the client MUST
     wait for a response from the server before sending any further data
* The client MUST validate the server's response as follows:
    * If the status code received from the server is not 101, the client handles the response per HTTP procedures
        * In
                 particular, the client might perform authentication if it
                 receives a 401 status code; the server might redirect the client
                 using a 3xx status code (but clients are not required to follow
                 them)
    * If the response lacks an |Upgrade| header field - the client MUST _Fail the WebSocket Connection_
    * If the response lacks a |Connection| header field - the client MUST _Fail the WebSocket Connection_
    * If the response lacks a |Sec-WebSocket-Accept| header field or the |Sec-WebSocket-Accept| contains a value other than the
      base64-encoded SHA-1 of the concatenation of the |Sec-WebSocket-
      Key| (as a string, not base64-decoded) with the string "258EAFA5-
      E914-47DA-95CA-C5AB0DC85B11" - the client MUST _Fail the WebSocket Connection_
    * If the response includes a |Sec-WebSocket-Extensions| header
             field and this header field indicates the use of an extension
             that was not present in the client's handshake (the server has
             indicated an extension not requested by the client), the client
             MUST _Fail the WebSocket Connection_
    * If the response includes a |Sec-WebSocket-Protocol| header field
             and this header field indicates the use of a subprotocol that was
             not present in the client's handshake (the server has indicated a
             subprotocol not requested by the client), the client MUST _Fail
             the WebSocket Connection_
    * If the server's response is validated as provided for above, it is
         said that _The WebSocket Connection is Established_ and that the
         WebSocket Connection is in the OPEN state
* A data center might have a server that responds to WebSocket
     requests with an appropriate handshake and then passes the connection
     to another server to actually process the data frames.
     * For the
          purposes of this specification, the "server" is the combination of
          both computers
* Reading the Client's Opening Handshake
    *  When a client starts a WebSocket connection, it sends its part of the
         opening handshake
    * If
         the server, while reading the handshake, finds that the client did
         not send a handshake that matches the description below the server MUST stop
         processing the client's handshake and return an HTTP response with an
         appropriate error code (such as 400 Bad Request)
* Sending the Server's Opening Handshake
    * When a client establishes a WebSocket connection to a server, the
         server MUST complete the following steps to accept the connection and
         send the server's opening handshake
        * if the connection is happening on an HTTPS (HTTP-over-TLS) port,
                 perform a TLS handshake over the connection, If this fails then close the connection
                 * otherwise, all further communication
                          for the connection (including the server's handshake) MUST run
                          through the encrypted tunnel
        * The server can perform additional client authentication, for
                 example, by returning a 401 status code with the corresponding
                 |WWW-Authenticate| header field
        * The server MAY redirect the client using a 3xx status code
        * /origin/ - If the server does
                               not validate the origin, it will accept connections from
                               anywhere
            * If the server does not wish to accept this
                        connection, it MUST return an appropriate HTTP error code
                        (e.g., 403 Forbidden) and abort the WebSocket handshake
* If the server chooses to accept the incoming connection, it MUST
         reply with a valid HTTP response indicating the following
         * 101 response code, HTTP/1.1 101
                                         Switching Protocols
         * An |Upgrade| header field with value "websocket"
         * A |Connection| header field with value "Upgrade"
         * A |Sec-WebSocket-Accept| header field
* the server considers
     the WebSocket connection to be established and that the WebSocket
     connection is in the OPEN state
     * At this point, the server may begin
          sending (and receiving) data

* four types of events
    * open
        * fired after connection request, after handshake
        * it means that connection is established
        * server is ready to send and receive messages                                                            
    * message
        * use to carry data
    * error
        * fired when a connection with a websocket has been closed because of an error
        * after an error event the WebSocket connection will be closed and a close event will be fired
    * close
        * fired when connection is closed
        * communication between client is over
        * has two attributes, code and reason
        * either side may terminate the connection
* The protocol has two parts:
    1. handshake
        * The handshake from the client looks as follows:
            ```
            GET /chat HTTP/1.1
            Host: server.example.com
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
            Origin: http://example.com
            Sec-WebSocket-Protocol: chat, superchat
            Sec-WebSocket-Version: 13
            ```
        * The handshake from the server looks as follows:
            ```
            HTTP/1.1 101 Switching Protocols
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
            Sec-WebSocket-Protocol: chat
            ```
    1. data transfer
        * Once the client and server have both sent their handshakes, and if
             the handshake was successful, then the data transfer part starts
        * This is a two-way communication channel where each side can,
             independently from the other, send data at will
        * After a successful handshake, clients and servers transfer data back
             and forth in conceptual units referred to in this specification as
             "messages"
            * On the wire, a message is composed of one or more frames
            * The WebSocket message does not necessarily correspond to a
                 particular network layer framing, as a fragmented message may be
                 coalesced or split by an intermediary
            * there are
                 types for textual data (which is interpreted as UTF-8
                 text), binary data (whose interpretation is left up to the
                 application), and control frames (which are not intended to carry
                 data for the application but instead for protocol-level signaling,
                 such as to signal that the connection should be closed).
# Closing Handshake
* Either peer can send a control frame with data containing a specified
     control sequence to begin the closing handshake
* Upon receiving such a frame, the other peer sends a
     Close frame in response, if it hasn't already sent one
* Upon
     receiving _that_ control frame, the first peer then closes the
     connection, safe in the knowledge that no further data is
     forthcoming
* After sending a control frame indicating the connection should be
     closed, a peer does not send any further data; after receiving a
     control frame indicating the connection should be closed, a peer
     discards any further data received
* It's also designed in such a way that its
     servers can share a port with HTTP servers, by having its handshake
     be a valid HTTP Upgrade request
* the intent of
     WebSockets is to provide a relatively simple protocol that can
     coexist with HTTP and deployed HTTP infrastructure (such as proxies)
*  It is similarly intended to fail to establish a connection when data
     from other protocols, especially HTTP, is sent to a WebSocket server,
     for example, as might happen if an HTML "form" were submitted to a
     WebSocket server.  
     * This is primarily achieved by requiring that the
     server prove that it read the handshake, which it can only do if the
     handshake contains the appropriate parts, which can only be sent by a
     WebSocket client
     * In particular, at the time of writing of this
          specification, fields starting with |Sec-| cannot be set by an
          attacker from a web browser using only HTML and JavaScript APIs such
          as XMLHttpRequest
# subprotocols
* The client can request that the server use a specific subprotocol by
     including the |Sec-WebSocket-Protocol| field in its handshake.  If it
     is specified, the server needs to include the same field and one of
     the selected subprotocol values in its response for the connection to
     be established.
* For example, if Example Corporation were to create a
     Chat subprotocol to be implemented by many servers around the Web,
     they could name it "chat.example.com"
    * If the Example Organization
         called their competing subprotocol "chat.example.org", then the two
         subprotocols could be implemented by servers simultaneously, with the
         server dynamically selecting which subprotocol to use based on the
         value sent by the client
# Opening Handshake

# 7.  Closing the Connection
# 5.  Data Framing