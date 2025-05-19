package school.sptech.notify;

import org.json.JSONObject;

import java.io.IOException;

public class App {
    public static void main(String[] args) throws IOException, InterruptedException {
        JSONObject json = new JSONObject();

        json.put("text", "Olá mundo!");
        Slack.enviarMensagem(json);
    }
}
