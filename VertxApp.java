import java.time.LocalDateTime;
import java.util.Date;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerResponse;
import org.vertx.java.core.http.RouteMatcher;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class VertxApp extends Verticle {

    @Override
    public void start() {
        final String mongo = "vertx.mongopersistor";

        container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", (AsyncResult<String> result) -> {
            if (result.succeeded()) {
                //clearing database
                JsonObject json = new JsonObject()
                        .putString("action", "delete")
                        .putString("collection", "vertx")
                        .putObject("matcher", new JsonObject());

                vertx.eventBus().send(mongo, json);
            } else {
                result.cause().printStackTrace();
            }
        });

        //setting up server
        HttpServer server = vertx.createHttpServer();
        RouteMatcher matcher = new RouteMatcher();

        //post route handler
        matcher.get("/post", req -> {
            JsonObject json = new JsonObject()
                    .putString("action", "save")
                    .putString("collection", "vertx")
                    .putObject("document", new JsonObject()
                            .putString("author", randomString(16))
                            .putString("date", LocalDateTime.now().toString())
                            .putString("content", randomString(160)));

            vertx.eventBus().send(mongo, json, (Message<JsonObject> reply) -> {
                if (reply.body().getString("status").equals("ok")) {
                    JsonObject json1 = new JsonObject()
                            .putString("action", "find")
                            .putString("collection", "vertx")
                            .putNumber("limit", 100)
                            .putObject("matcher", new JsonObject());
                    vertx.eventBus().send(mongo, json1, (Message<JsonObject> reply1) -> {
                        if (reply1.body().getString("status").equals("ok")) {
                            addHeaders(req.response());
                            req.response().end(reply1.body().getArray("results").encode());
                        } else {
                            addHeaders(req.response());
                            req.response().setStatusCode(500).end();
                        }
                    });
                } else {
                    addHeaders(req.response());
                    req.response().setStatusCode(500).end();
                }
            });
        });

        //hello route handler
        matcher.get("/hello", req -> {
            addHeaders(req.response());
            req.response().end(new JsonObject().putString("message", "hello").encode());
        });

        //concat route handler
        matcher.get("/concat", req -> {
            final String response = randomString(10000);

            addHeaders(req.response());
            req.response().end(new JsonObject().putString("concat", response).encode());
        });

        // fibonacci route handler
        matcher.get("/fibonacci", req -> {
            fibonacci(30);

            addHeaders(req.response());
            req.response().end(new JsonObject().putString("fibonacci", "calculated").encode());
        });

        server.requestHandler(matcher).listen(1337);
    }

    //helper http headers function
    private void addHeaders(final HttpServerResponse response) {
        response.putHeader("Content-Type", "application/json")
                .putHeader("Date", new Date().toString())
                .putHeader("Connection", "close");
    }

    //helper function for random string generation
    private String randomString(int len) {
        final String alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        final StringBuilder result = new StringBuilder();
        int rand;

        for (int i = 0; i < len; i++) {
            rand = (int) Math.floor(Math.random() * (alphabet.length()));
            result.append(alphabet.substring(rand, rand + 1));
        }

        return result.toString();
    }

    //helper Fibonacci function
    private long fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
}
