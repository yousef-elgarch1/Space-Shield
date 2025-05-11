package com.debriswatch.debristracker.fetcher;

import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.debriswatch.debristracker.Factory.TleObjectFactory;
import com.debriswatch.debristracker.model.Debris;
import com.debriswatch.debristracker.model.RocketBody;
import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;

import io.github.cdimascio.dotenv.Dotenv;

@Component
public class SpaceTrackTleFetcher extends TleFetcher {

    private final HttpClient client = HttpClient.newBuilder().cookieHandler(new CookieManager()).build();
    private String username;
    private String password;
public SpaceTrackTleFetcher(Dotenv dotenv) {
    this.username = dotenv.get("SPACE_TRACK_USERNAME");
    this.password = dotenv.get("SPACE_TRACK_PASSWORD");
}
    @Autowired SatelliteRepository satelliteRepo;
    @Autowired DebrisRepository debrisRepo;
    @Autowired RocketBodyRepository rocketRepo;
    @Autowired TleRepository tleRepo;
    @Autowired TleObjectFactory tleObjectFactory;

// authentification method

    @Override
    protected void authenticate() throws Exception {

        HttpRequest loginRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://www.space-track.org/ajaxauth/login"))
                .POST(HttpRequest.BodyPublishers.ofString("identity=" + username + "&password=" + password))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .build();

        client.send(loginRequest, HttpResponse.BodyHandlers.discarding());
    }

// fetch raw data 

    @Override
    protected String fetchRawData() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://www.space-track.org/basicspacedata/query/class/tle_latest/limit/100/format/json"))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

// save the tle data in the database 

    @Override
    protected void saveTleData(List<TleData> tleList) {
        tleRepo.saveAll(tleList);
        for (TleData tle : tleList) {
            TleData obj = tleObjectFactory.create(tle);
            if (obj instanceof Debris d) debrisRepo.save(d);
            else if (obj instanceof RocketBody r) rocketRepo.save(r);
            else if (obj instanceof Satellite s) satelliteRepo.save(s);
        }
    }


}

