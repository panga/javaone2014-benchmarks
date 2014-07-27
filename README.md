JavaOne 2014 Benchmarks
=======================

Simple and naive Node.js, vert.x, avatar.js and Avatar benchmarks

- Node.js app uses Restify framework and Mongoose module  
- vert.x app uses mongo-persistor module (Java)
- avatar.js was tested with Node.js app
- Avatar app uses Mongoose module
- The database is MongoDB

Testing environment
-------------------

* Amazon EC2 c3.xlarge Instance (4 CPU, 7.5GB RAM, 80GB SSD)
* Red Hat Enterprise Linux 6.5 (PV) 64-bit
* MongoDB 2.6.3
* Node.js 0.10.29 (2014-06-16)
* vert.x 2.1.1 (2014-06-18)
* avatar-js 0.10.28-SNAPSHOT (2014-07-20)
* Avatar 1.0-ea-SNAPSHOT (2014-07-26)
* GlassFish 4.0.1-b09 (2014-07-23)
* JDK 8 SE (build 1.8.0_05-b13, x64)
* JDK 8 Embedded (build 1.8.0-b132, x86, profile compact3, vm client, nashorn extension)
* ulimit = unlimited
* server and client in localhost (no networking)
* all applications and frameworks with default settings

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

[1.2] Vertx (Nashorn with JDK 8 SE)

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

[1.3] Vertx (Java with JDK 8 SE)

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

[1.4] Vertx (Java with JDK 8 Embedded)

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
Total memory:                    ~80 MB

[1.5] Vertx (Nashorn with JDK 8 Embedded)

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
Total memory:                   ~100 MB

[1.6] Avatar.js (Nashorn with JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                 186.46 secs
Data transferred:             268.95 MB
Response time:                  1.30 secs
Transaction rate:              53.63 trans/sec
Throughput:                     1.44 MB/sec
Concurrency:                   69.86
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            2.14
Shortest transaction:           0.01
Total memory:                  ~1500 MB

[1.7] Avatar (Nashorn on Glassfish 4 with JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                 197.32 secs
Data transferred:             268.95 MB
Response time:                  1.43 secs
Transaction rate:              50.68 trans/sec
Throughput:                     1.36 MB/sec
Concurrency:                   72.24
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            2.20
Shortest transaction:           0.01
Total memory:                  ~1600 MB
```

* Most of 1.x tests reached local MongoDB instance limits

### Returning a simple JSON response

Short JSON was returned in response to every request, no calculations performed.

Benchmarking command: **siege -c100 -b -r1000 http://localhost:1337/hello**

```
[2.1] Node.js

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  61.04 secs
Data transferred:               1.81 MB
Response time:                  0.06 secs
Transaction rate:            1638.27 trans/sec
Throughput:                     0.03 MB/sec
Concurrency:                   99.91
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.11
Shortest transaction:           0.02
Total memory:                    ~70 MB

[2.2] Vertx (Nashorn with JDK 8 SE)

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  29.83 secs
Data transferred:               1.81 MB
Response time:                  0.03 secs
Transaction rate:            3352.33 trans/sec
Throughput:                     0.06 MB/sec
Concurrency:                   99.83
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.06
Shortest transaction:           0.00
Total memory:                   ~200 MB

[2.3] Vertx (Java with JDK 8 SE)

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  27.05 secs
Data transferred:               1.81 MB
Response time:                  0.03 secs
Transaction rate:            3696.86 trans/sec
Throughput:                     0.07 MB/sec
Concurrency:                   99.83
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.05
Shortest transaction:           0.00
Total memory:                   ~120 MB

[2.4] Vertx (Java with JDK 8 Embedded)

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  33.83 secs
Data transferred:               1.81 MB
Response time:                  0.03 secs
Transaction rate:            2955.96 trans/sec
Throughput:                     0.05 MB/sec
Concurrency:                   99.82
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.06
Shortest transaction:           0.00
Total memory:                    ~60 MB

[2.5] Vertx (Nashorn with JDK 8 Embedded)

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  39.92 secs
Data transferred:               1.81 MB
Response time:                  0.04 secs
Transaction rate:            2505.01 trans/sec
Throughput:                     0.05 MB/sec
Concurrency:                   99.85
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.07
Shortest transaction:           0.00
Total memory:                    ~80 MB

[2.6] Avatar.js (Nashorn with JDK 8 SE)

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  95.52 secs
Data transferred:               1.81 MB
Response time:                  0.10 secs
Transaction rate:            1046.90 trans/sec
Throughput:                     0.02 MB/sec
Concurrency:                   99.94
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.16
Shortest transaction:           0.01
Total memory:                   ~900 MB

[2.7] Avatar (Nashorn on Glassfish 4 with JDK 8 SE)

Transactions:                 100000 hits
Availability:                 100.00 %
Elapsed time:                  41.49 secs
Data transferred:               1.81 MB
Response time:                  0.04 secs
Transaction rate:            2410.22 trans/sec
Throughput:                     0.04 MB/sec
Concurrency:                   99.83
Successful transactions:      100000
Failed transactions:               0
Longest transaction:            0.98
Shortest transaction:           0.00
Total memory:                   ~600 MB
```

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

[3.2] Vertx (Nashorn with JDK 8 SE)

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

[3.3] Vertx (Java with JDK 8 SE)

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

[3.4] Vertx (Java with JDK 8 Embedded)

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
Total memory:                    ~60 MB

[3.5] Vertx (Nashorn with JDK 8 Embedded)

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
Total memory:                    ~80 MB

[3.6] Avatar.js (Nashorn with JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  18.93 secs
Data transferred:              95.49 MB
Response time:                  0.19 secs
Transaction rate:             528.26 trans/sec
Throughput:                     5.04 MB/sec
Concurrency:                   99.55
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.21
Shortest transaction:           0.01
Total memory:                   ~680 MB

[3.7] Avatar (Nashorn on Glassfish 4 with JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  13.30 secs
Data transferred:              95.49 MB
Response time:                  0.13 secs
Transaction rate:             751.88 trans/sec
Throughput:                     7.18 MB/sec
Concurrency:                   99.52
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.57
Shortest transaction:           0.01
Total memory:                   ~580 MB

[3.8] Vertx 4 instances (Nashorn with JDK 8 SE)

Transactions:                  10000 hits
Availability:                 100.00 %
Elapsed time:                  10.28 secs
Data transferred:              95.49 MB
Response time:                  0.10 secs
Transaction rate:             972.76 trans/sec
Throughput:                     9.29 MB/sec
Concurrency:                   96.96
Successful transactions:       10000
Failed transactions:               0
Longest transaction:            0.26
Shortest transaction:           0.00
Total memory:                   ~450 MB
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

[4.2] Vertx (Nashorn with JDK 8 SE)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  30.40 secs
Data transferred:               0.02 MB
Response time:                  2.89 secs
Transaction rate:              32.89 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.10
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            3.11
Shortest transaction:           0.05
Total memory:                   ~730 MB

[4.3] Vertx (Java with JDK 8 SE)

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

[4.4] Vertx (Java with JDK 8 Embedded)

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
Total memory:                    ~55 MB

[4.5] Vertx (Nashorn with JDK 8 Embedded)

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
Total memory:                   ~360 MB

[4.6] Vertx 4 instances (Java with JDK 8 SE)

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

[4.7] Vertx 4 instances (Java with JDK 8 Embedded)

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
Total memory:	                 ~65 MB

[4.8] Avatar.js (Nashorn with JDK 8 SE)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  41.09 secs
Data transferred:               0.02 MB
Response time:                  3.91 secs
Transaction rate:              24.34 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.12
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            4.31
Shortest transaction:           0.07
Total memory:	                ~900 MB

[4.9] Avatar (Nashorn on Glassfish 4 with JDK 8 SE)

Transactions:                   1000 hits
Availability:                 100.00 %
Elapsed time:                  32.64 secs
Data transferred:               0.02 MB
Response time:                  3.11 secs
Transaction rate:              30.64 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                   95.17
Successful transactions:        1000
Failed transactions:               0
Longest transaction:            3.51
Shortest transaction:           0.04
Total memory:                   ~520 MB
```

Fun facts
---------

* Naming your Node.js application file 'node.js' on Windows is a bad idea.
* Naming your vert.x application file 'vertx.js' on Windows is a bad idea.
* Avatar app need use global node_modules.