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
    * full-duplex (both directions),
        * provides it without hacks (like long pooling, http2 push notifications, etc.)
    * asynchronous communications channel
* is an independent TCP-based protocol
    * single TCP connection for traffic in both directions
* once the WebSocket handshake is finished, only the WebSocket protocol is used, not HTTP anymore
    * only relationship to HTTP is that its handshake is interpreted by HTTP servers as an Upgrade request
* the intent of WebSockets is to provide a relatively simple protocol that can coexist with HTTP and 
deployed HTTP infrastructure (such as proxies)
* It's also designed in such a way that its
     servers can share a port with HTTP servers, by having its handshake
     be a valid HTTP Upgrade request
* by default, the WebSocket Protocol uses port 80 for regular WebSocket connections and port 443 for 
    WebSocket connections tunneled over Transport Layer Security (TLS)
* supports text and binary data

## digression
### long polling
1. server holds the request open
1. waiting for a state change (e.g. new data emerges)
1. push response to the client
1. when client receives response - it immediately sends another request and whole process repeats

* drawback - it is not scalable: to maintain the session state for a given client, that state must either:
    * must be sharable among all servers behind a load balancer – significant architectural complexity
    * or subsequent client requests within the same session must be routed to the same server to 
    which their original request was processed - contradiction of load-balancing
    
### http2 push notifications
* is a concept which allows the server to respond to a request with more than one response
* data is still sent only in response to an initial request
* it’s impossible to push data based purely on the server deciding that 
the client may want or need it
    
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
* WebSocket server's handshake is an HTTP Switching Protocols response
     ```
     HTTP/1.1 101 Switching Protocols
     Upgrade: websocket
     Connection: Upgrade
     Sec-WebSocket-Accept: lRpQzaMfn9PshDM89sErE1GVs2s=
     ```
### Opening handshake headers summary
|Header                     |Required       |Value   |
|---                        |---            |---|
|Host                       |Yes            |server’s authority   |
|Upgrade                    |Yes            |websocket   |
|Connection                 |Yes            |Upgrade   |
|Sec-WebSocket-Key          |Yes            |base64-encoded value   |
|Sec-WebSocket-Version      |Yes            |13   |
|Sec-WebSocket-Accept       |Yes (server)   |must be present for the connection to be valid   |
|Origin                     |No             |sent by all browser clients   |
|Sec-WebSocket-Protocol     |No             |protocols the client would like to speak, ordered by preference   |
|Sec-WebSocket-Extensions   |No             |extensions the client would like to speak   |

The request MAY include any other header fields, for example, cookies and/or authentication-related header fields
such as the |Authorization| header field, which are processed according to documents that define them

## details
### client
1. To _Establish a WebSocket Connection_, a client opens a connection and sends a handshake as defined above.
    * If |secure| header is true, the client MUST perform a TLS handshake just after opening the connection 
    and before sending the handshake data
        * all further communication on this channel MUST run through the encrypted tunnel 
1. A connection is defined to initially be in a CONNECTING state.
    
    |State        |Value    |Description   |
    |---          |---      |---|
    |CONNECTING   |0        |The connection is not yet open.   |
    |OPEN         |1        |The connection is open and ready to communicate.   |
    |CLOSING      |2        |The connection is in the process of closing.   |
    |CLOSED       |3        |The connection is closed or couldn’t be opened.   |
1. once the client's opening handshake has been sent, the client MUST wait for a response from the server 
   before sending any further data
### server
1. If the server chooses to accept the incoming connection, it MUST reply with a valid HTTP response:
    * 101 response code, HTTP/1.1 101 Switching Protocols
    * required headers according to: [Opening handshake headers summary](#Opening-handshake-headers-summary)
1. server selects one or none of the acceptable protocols and echoes that value in its handshake to indicate 
that it has selected that protocol
    * |origin| - if the server does not validate the origin, it will accept connections from anywhere
    * If the server does not wish to accept this connection, it MUST return an appropriate HTTP error code
      (e.g., 403 Forbidden) and abort the WebSocket handshake
    * otherwise the server considers the WebSocket connection to be established and that the WebSocket connection 
    is in the OPEN state and at this point, the server may begin sending (and receiving) data
### client
1. The client MUST validate the server's response as follows:
    * If the status code received from the server is not 101, the client handles the response per HTTP procedures
        * In particular, the client might perform authentication if it receives a 401 status code; 
        the server might redirect the client using a 3xx status code (but clients are not required to follow them)
    * required headers according to: [Opening handshake headers summary](#Opening-handshake-headers-summary)
    * If the `|Sec-WebSocket-Accept|` contains a value other than the
      base64-encoded SHA-1 of the concatenation of the `|Sec-WebSocket-
      Key|` (as a string, not base64-decoded) with the string `"258EAFA5-
      E914-47DA-95CA-C5AB0DC85B11"` - the client MUST _Fail the WebSocket Connection_
        * GUID - it is unlikely (possible, put with very small probability) that the server which is not 
        aware of Websockets will use it - it just ensures that server understands websockets protocol
        * prevent clients accidentally requesting websockets upgrade not expecting it (say, by adding 
        corresponding headers manually and then expecting smth else). Sec-WebSocket-Key and other related 
        headers are prohibited to be set using setRequestHeader method in browsers
    * If the response includes a `|Sec-WebSocket-Extensions|` header
             field and this header field indicates the use of an extension
             that was not present in the client's handshake (the server has
             indicated an extension not requested by the client), the client
             MUST _Fail the WebSocket Connection_
    * If the response includes a |Sec-WebSocket-Protocol| header field
             and this header field indicates the use of a subprotocol that was
             not present in the client's handshake (the server has indicated a
             subprotocol not requested by the client), the client MUST _Fail
             the WebSocket Connection_    
1. If the server's response is validated as provided for above, it is
         said that _The WebSocket Connection is Established_ and that the
         WebSocket Connection is in the OPEN state
         
# Closing the Connection
## overview
1. A closing of the WebSocket connection may be initiated by either endpoint (client or the server),
     potentially simultaneously
1. endpoint MUST send a Close control frame with |code| and |reason|
1. Once an endpoint has both sent and received a Close control frame, that endpoint SHOULD 
_Close the WebSocket Connection_
## details
* to _Close the WebSocket Connection_, an endpoint closes the underlying TCP connection
* the underlying TCP connection, in most normal cases, SHOULD be closed first by the server
* when a server is instructed to _Close the WebSocket Connection_ it SHOULD initiate a TCP Close 
immediately, and when a client is instructed to do the same, it SHOULD wait for a TCP Close from the server
* upon either sending or receiving a Close control frame, it is said that 
_The WebSocket Closing Handshake is Started_ and that the WebSocket connection is in the CLOSING state
* when the underlying TCP connection is closed, it is said that _The WebSocket Connection is Closed_ 
and that the WebSocket connection is in the CLOSED state
    * If the TCP connection was closed after the WebSocket closing handshake 
    was completed, the WebSocket connection is said to have been closed _cleanly_
* Two endpoints may not agree on the value of _The WebSocket Connection Close Code_
     * As an example, if the remote endpoint sent a
          Close frame but the local application has not yet read the data
          containing the Close frame from its socket's receive buffer, and the
          local application independently decided to close the connection and
          send a Close frame, both endpoints will have sent and received a
          Close frame and will not send further Close frames
     * Each endpoint
          will see the status code sent by the other end as _The WebSocket
          Connection Close Code_
* each deployed client experiences an
     abnormal closure and immediately and persistently tries to reconnect,
     the server may experience what amounts to a denial-of-service attack
     by a large number of clients trying to reconnect.  The end result of
     such a scenario could be that the service is unable to recover in a
     timely manner or recovery is made much more difficult
     * to prevent this, clients SHOULD use some form of backoff when trying
          to reconnect after abnormal closures as described in this section.
          * the first reconnect attempt SHOULD be delayed by a random amount of
               time.  The parameters by which this random delay is chosen are left
               to the client to decide; a value chosen randomly between 0 and 5
               seconds is a reasonable initial delay though clients MAY choose a
               different interval from which to select a delay length based on
               implementation experience and particular application.
          * Should the first reconnect attempt fail, subsequent reconnect
               attempts SHOULD be delayed by increasingly longer amounts of time,
               using a method such as truncated binary exponential backoff.
* Servers MAY close the WebSocket connection whenever desired.  Clients
     SHOULD NOT close the WebSocket connection arbitrarily
## details        
### status codes
When closing an established connection (e.g., when sending a Close
   frame, after the opening handshake has completed), an endpoint MAY
   indicate a reason for closure
   
|Ranges         |Description   |
|---            |---|
|0-999          |not used   |
|1000-2999      |reserved  by protocol, pre-defined status codes   |
|3000-3999      |reserved by libraries, frameworks, and applications, registered with IANA   |
|4000-4999      |reserved for private use, not registered   |

|Code   |Description   |
|---    |---|
|1000   |normal closure - the purpose for which the connection was established has been fulfilled   |
|1001   |endpoint is "going away" - ex. server going down or a browser having navigated away from a page   |
|1002   |protocol error   |
|1003   |received a type of data it cannot accept - ex. text vs binary   |
|1004   |not yet defined   |
|1005   |MUST NOT be set as a status code - it is designated for use in applications expecting a status code to indicate that no status code was actually present   |
|1006   |MUST NOT be set as a status code - It is designated for use in applications expecting a status code to indicate that the connection was closed abnormally, e.g., without sending or receiving a Close control fram   |
|1007   |received data within a message that was not consistent with the type of the message - ex. non-UTF-8 data within a text message   |
|1008   |received a message that violates its policy   |
|1009   |message that is too big to process   |
|1010   |(client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake Note that this status code is not used by the server, because it can fail the WebSocket handshake instead   |
|1011   |server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request   |
|1015   |failure to perform a TLS handshake (e.g., the server certificate can't be verified).   |
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
        
* There is no limit to the number of established WebSocket connections a client can have with a single remote host.  
Servers can refuse to accept connections from hosts/IP addresses with an excessive number of existing connections 
or disconnect resource-hogging connections when suffering high load
    * For example, in a web browser context, the client needs to consider the number of tabs the user has open 
    in setting a limit to the number of simultaneous pending connections
* A server can further reduce the
         load on itself when attacked by pausing before closing the
         connection, as that will reduce the rate at which the client
         reconnects
* Sec-WebSocket-Key
    * random numbers selected randomly for each connection
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
# 5.  Data Framing
# 6.  Sending and Receiving Data