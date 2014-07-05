Node.js vs vert.x
=================

Simple and naive Node.js vs vert.x benchmark  
Node.js server uses Restify framework and Mongoose ORM  
Vert.x uses mongo-persistor module (Java)  
The database is MongoDB  

Testing environment
-------------------

* Hardware: Amazon EC2 c3.xlarge Instance (4 CPU, 7.5GB RAM, 80GB SSD)
* Operating System: Red Hat Enterprise Linux 6.5 (PV) 64-bit
* Node.js v0.10.29 (2014-06-16)
* vert.x 2.1.1 (2014-06-18)
* JDK 8 SE (build 1.8.0_05-b13)
* JDK 8 Embedded (build 1.8.0-b132, profile compact3, vm client, nashorn extension)
* ulimit = unlimited
* server = localhost
* test client = localhost
* default V8/JVM and Node.js/vert.x settings

Fairness considerations
-----------------------

Restify adds it's own headers such as X-Response-Time, Content-MD5, X-Request-Id, Date and so on. To be fair I removed unnecessary calculations from Restify and added some of them to vert.x code so that both servers return the same set of headers and perform (more or less) the same calculations. I got rid of MD5 response hash because it took about 40ms to calculate it using JavaScript function (Restify uses OpenSSL for that).

Benchmark results
-----------------

Benchmarks were performed using Siege. All test data is generated on the fly.

### Posting and selecting from database

Request adds a random JSON document to database:

    author: String(16)
    date: Date
    content: String(160)

and gets 100 already stored documents in response (no sorting).

Benchmarking command: **siege -c100 -d1 -r100 http://localhost:1337/post**

```
[1.1] Node.js

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  67.19 secs
Data transferred:             267.93 MB
Response time:                  0.08 secs
Transaction rate:             148.83 trans/sec
Throughput:                     3.99 MB/sec
Concurrency:                   12.15
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.41
Shortest transaction:           0.00
Total memory:                    ~75 MB

[1.2] Vertx (Rhino)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  64.25 secs
Data transferred:             267.78 MB
Response time:                  0.02 secs
Transaction rate:             155.64 trans/sec
Throughput:                     4.17 MB/sec
Concurrency:                    3.06
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.77
Shortest transaction:           0.00
Total memory:                   ~580 MB

[1.3] Vertx (Nashorn)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  61.86 secs
Data transferred:             267.80 MB
Response time:                  0.02 secs
Transaction rate:             161.66 trans/sec
Throughput:                     4.33 MB/sec
Concurrency:                    3.27
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.96
Shortest transaction:           0.00
Total memory:                   ~620 MB

[1.4] Vertx (JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  63.43 secs
Data transferred:             266.82 MB
Response time:                  0.01 secs
Transaction rate:             157.65 trans/sec
Throughput:                     4.21 MB/sec
Concurrency:                    1.33
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.49
Shortest transaction:           0.00
Total memory:                   ~275 MB

[1.5] Vertx (JDK 8 Embedded)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  61.30 secs
Data transferred:             266.84 MB
Response time:                  0.01 secs
Transaction rate:             163.13 trans/sec
Throughput:                     4.35 MB/sec
Concurrency:                    1.83
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.39
Shortest transaction:           0.00
Memory consumed:                 ~80 MB

[1.6] Vertx (Nashorn with JDK 8 Embedded)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  64.27 secs
Data transferred:             267.78 MB
Response time:                  0.04 secs
Transaction rate:             155.59 trans/sec
Throughput:                     4.17 MB/sec
Concurrency:                    5.54
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.69
Shortest transaction:           0.00
Memory consumed:                ~100 MB
```

* 1.x tests reached local MongoDB instance limits

### Returning a simple JSON response

Short JSON was returned in response to every request, no calculations performed.

Benchmarking command: **siege -c100 -b -r1000 http://localhost:1337/hello**

```
[2.1] Node.js

Transactions:                  28233 hits
Availability:                  96.31 %
Elapsed time:                  18.70 secs
Data transferred:               0.51 MB
Response time:                  0.07 secs
Transaction rate:            1509.79 trans/sec
Throughput:                     0.03 MB/sec
Concurrency:                   98.28
Successful transactions:       28233
Failed transactions:            1081
Longest transaction:            0.94
Shortest transaction:           0.02
Total memory:                    ~85 MB

[2.2] Vertx (Rhino)

Transactions:                  28231 hits
Availability:                  96.17 %
Elapsed time:                  13.01 secs
Data transferred:               0.51 MB
Response time:                  0.04 secs
Transaction rate:            2169.95 trans/sec
Throughput:                     0.04 MB/sec
Concurrency:                   96.17
Successful transactions:       28231
Failed transactions:            1123
Longest transaction:            0.64
Shortest transaction:           0.02
Total memory:                   ~160 MB

[2.3] Vertx (Nashorn)

Transactions:                  28231 hits
Availability:                  96.18 %
Elapsed time:                  11.26 secs
Data transferred:               0.51 MB
Response time:                  0.04 secs
Transaction rate:            2507.19 trans/sec
Throughput:                     0.05 MB/sec
Concurrency:                   96.16
Successful transactions:       28231
Failed transactions:            1122
Longest transaction:            0.81
Shortest transaction:           0.02
Total memory:                   ~180 MB

[2.4] Vertx (JDK 8 SE)

Transactions:                  28131 hits
Availability:                  96.16 %
Elapsed time:                   9.77 secs
Data transferred:               0.51 MB
Response time:                  0.03 secs
Transaction rate:            2879.32 trans/sec
Throughput:                     0.05 MB/sec
Concurrency:                   94.38
Successful transactions:       28131
Failed transactions:            1123
Longest transaction:            0.74
Shortest transaction:           0.01
Total memory:                   ~165 MB

[2.5] Vertx (JDK 8 Embedded)

Transactions:                  28231 hits
Availability:                  96.19 %
Elapsed time:                  10.53 secs
Data transferred:               0.51 MB
Response time:                  0.04 secs
Transaction rate:            2681.01 trans/sec
Throughput:                     0.05 MB/sec
Concurrency:                   95.22
Successful transactions:       28231
Failed transactions:            1119
Longest transaction:            0.85
Shortest transaction:           0.02
Memory consumed:                 ~60 MB

[2.6] Vertx (Nashorn with JDK 8 Embedded)

Transactions:                  21487 hits
Availability:                  95.03 %
Elapsed time:                   9.04 secs
Data transferred:               0.39 MB
Response time:                  0.04 secs
Transaction rate:            2376.88 trans/sec
Throughput:                     0.04 MB/sec
Concurrency:                   94.53
Successful transactions:       21487
Failed transactions:            1123
Longest transaction:            0.86
Shortest transaction:           0.00
Memory consumed:                 ~65 MB
```

* 2.x tests were aborted due to excessive socket failure

### String concatenation

Random 10000 characters long strings were returned to this requests. No buffers were used, just plain old strings and concatenation (one character at a time).

Benchmarking command: **siege -c100 -b -r100 http://localhost:1337/concat**

```
[3.1] Node.js

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  11.18 secs
Data transferred:              95.49 MB
Response time:                  0.11 secs
Transaction rate:             894.45 trans/sec
Throughput:                     8.54 MB/sec
Concurrency:                   99.51
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.17
Shortest transaction:           0.03
Total memory:                    ~75 MB

[3.2] Vertx (Rhino)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  52.43 secs
Data transferred:              95.49 MB
Response time:                  0.52 secs
Transaction rate:             190.73 trans/sec
Throughput:                     1.82 MB/sec
Concurrency:                   99.50
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            1.12
Shortest transaction:           0.31
Total memory:                   ~630 MB

[3.3] Vertx (Nashorn)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  14.25 secs
Data transferred:              95.49 MB
Response time:                  0.14 secs
Transaction rate:             701.75 trans/sec
Throughput:                     6.70 MB/sec
Concurrency:                   99.56
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.92
Shortest transaction:           0.10
Total memory:                   ~440 MB

[3.4] Vertx (JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                   9.56 secs
Data transferred:              95.49 MB
Response time:                  0.10 secs
Transaction rate:            1046.03 trans/sec
Throughput:                     9.99 MB/sec
Concurrency:                   99.49
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.31
Shortest transaction:           0.07
Total memory:                   ~255 MB

[3.5] Vertx (JDK 8 Embedded)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  14.42 secs
Data transferred:              95.49 MB
Response time:                  0.14 secs
Transaction rate:             693.48 trans/sec
Throughput:                     6.62 MB/sec
Concurrency:                   99.46
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.16
Shortest transaction:           0.00
Memory consumed:                 ~60 MB

[3.6] Vertx (Nashorn with JDK 8 Embedded)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  42.58 secs
Data transferred:              95.49 MB
Response time:                  0.42 secs
Transaction rate:             234.85 trans/sec
Throughput:                     2.24 MB/sec
Concurrency:                   99.46
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.47
Shortest transaction:           0.02
Memory consumed:                 ~80 MB
```

### Fibonacci

The most famous benchmark out there. Calculating **fib(30)** recursively.

Benchmarking command: **siege -c100 -b -r10 http://localhost:1337/fibonacci**

```
[4.1] Node.js

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  14.04 secs
Data transferred:               0.02 MB
Response time:                  1.34 secs
Transaction rate:              71.23 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.11
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            1.46
Shortest transaction:           0.04
Total memory:                    ~65 MB

[4.2] Vertx (Rhino)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  66.33 secs
Data transferred:               0.02 MB
Response time:                  6.31 secs
Transaction rate:              15.08 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.15
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            7.56
Shortest transaction:           0.31
Total memory:                   ~680 MB

[4.3] Vertx (Nashorn)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  33.37 secs
Data transferred:               0.02 MB
Response time:                  3.18 secs
Transaction rate:              29.97 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.27
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            4.19
Shortest transaction:           0.50
Total memory:                   ~730 MB

[4.4] Vertx (JDK 8 SE)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                   4.69 secs
Data transferred:               0.02 MB
Response time:                  0.45 secs
Transaction rate:             213.22 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   95.03
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            0.50
Shortest transaction:           0.02
Total memory:                   ~100 MB

[4.5] Vertx (JDK 8 Embedded)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                   5.02 secs
Data transferred:               0.02 MB
Response time:                  0.48 secs
Transaction rate:             199.20 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.01
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            0.52
Shortest transaction:           0.01
Memory consumed:                 ~55 MB

[4.6] Vertx (Nashorn with JDK 8 Embedded)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  34.24 secs
Data transferred:               0.02 MB
Response time:                  3.26 secs
Transaction rate:              29.21 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.13
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            4.03
Shortest transaction:           0.33
Memory consumed:                ~360 MB

[4.7] Vertx 4 instances (JDK 8 SE)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                   2.25 secs
Data transferred:               0.02 MB
Response time:                  0.21 secs
Transaction rate:             444.44 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   94.52
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            0.42
Shortest transaction:           0.04
Total memory:                   ~180 MB

[4.8] Vertx 4 instances (JDK 8 Embedded)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                   2.35 secs
Data transferred:               0.02 MB
Response time:                  0.22 secs
Transaction rate:             425.53 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   94.40
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            0.28
Shortest transaction:           0.01
Memory consumed:                 ~65 MB
```

Fun facts
---------

* Naming your vert.x application file 'vertx.js' is a bad idea.
* Naming your Node.js application file 'node.js' on Windows is a bad idea.