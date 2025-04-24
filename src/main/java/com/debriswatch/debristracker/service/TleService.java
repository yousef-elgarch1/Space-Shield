package com.debriswatch.debristracker.service;
import io.github.cdimascio.dotenv.Dotenv;
import com.debriswatch.debristracker.model.Debris;
import com.debriswatch.debristracker.model.RocketBody;
import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.net.http.HttpRequest;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
//     fetching the tle data for orbits and debris predictions de space track api
@Service
public class TleService {
    public  TleService(){
        System.out.println("Singleton instance created");  
    }
    @Autowired
    public TleService(SatelliteRepository satelliteRepository ,RocketBodyRepository rocketBodyRepository,DebrisRepository debrisRepository ){
  this.debrisRepository=debrisRepository;
  this.rocketBodyRepository=rocketBodyRepository;
  this.satelliteRepository=satelliteRepository;
    }
  
// Every 36 seconds = 100 requests/hour
// Within Space-Track limit: max 300 req/hour      
//Limit API queries to less than 30 requests per 1 minute(s) / 300 requests per 1 hour(s) 
/* 
 @Scheduled(fixedRate = (long) (0.6 * 60 * 1000))
 public void autoUpdateTleData() {
    System.out.println("🔄 Auto-fetching latest TLE data...");
    fetchAndProcessTleData(); // your existing method
}
*/
@Autowired
private SatelliteRepository satelliteRepository;
@Autowired
private RocketBodyRepository rocketBodyRepository;
@Autowired
private DebrisRepository debrisRepository;
@Autowired
private TleRepository tleRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()); // For LocalDateTime support
    /* 
    @PostConstruct
    public void init() {
        System.out.println("🚀 App started, fetching TLE data...");
        fetchAndProcessTleData();
    }
    */
    public void fetchAndProcessTleData() {
        final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        final String username = dotenv.get("SPACE_TRACK_USERNAME");
        final String password = dotenv.get("SPACE_TRACK_PASSWORD");
       
        String loginUrl = "https://www.space-track.org/ajaxauth/login";
        String tleUrl = "https://www.space-track.org/basicspacedata/query/class/tle_latest/limit/100/format/json";
    
        try { 
//                  manage cookies for the authentification error using cookie handler 
//                  Create the client 
     HttpClient client = HttpClient.newBuilder()
    .cookieHandler(new CookieManager())
    .build();
//                   Authentification request 
            System.out.println("Sending login request...");
            HttpRequest loginRequest = HttpRequest.newBuilder()
                    .uri(URI.create(loginUrl))
                    .POST(HttpRequest.BodyPublishers.ofString("identity=" + username + "&password=" + password))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .build();
    
            HttpResponse<Void> loginResponse = client.send(loginRequest, HttpResponse.BodyHandlers.discarding());
            System.out.println("Login status: " + loginResponse.statusCode());
    
            System.out.println(" Fetching TLE data...");
            HttpRequest tleRequest = HttpRequest.newBuilder()
                    .uri(URI.create(tleUrl))
                    .build();
    
            HttpResponse<String> response = client.send(tleRequest, HttpResponse.BodyHandlers.ofString());
            System.out.println(" TLE fetch status: " + response.statusCode());
    
            String tleJson = response.body();
            System.out.println(" Raw TLE JSON:\n" );
    
            List<TleData> tleDataList = parseTleJson(tleJson);
            System.out.println(" Parsed TLE records: " + tleDataList.size());
    
            System.out.println(" Saving to DB...");
            tleRepository.saveAll(tleDataList);
            System.out.println(" Save complete");
            
        // to be changed 
          for (TleData tle : tleDataList) {
              String type=tle.getObjectType().toUpperCase();

          if(type.equals("DEBRIS")){
               Debris debris=new Debris(tle);
                debrisRepository.save(debris);
          }else if(type.equals("ROCKET BODY")) {
              RocketBody rocketBody = new RocketBody(tle);
              rocketBodyRepository.save(rocketBody);
          }else {
          Satellite satellite=new Satellite(tle);
           satelliteRepository.save(satellite);
            }}
         } catch (Exception e) {
            System.err.println(" Error occurred:");
            e.printStackTrace();
        }
    } 
    
    List<TleData> parseTleJson(String tleJson) throws Exception {
        objectMapper.findAndRegisterModules(); // Handles LocalDateTime
        return objectMapper.readValue(tleJson, new TypeReference<List<TleData>>() {});
    }
    public Long tLong(String string) {
        try {
            return Long.parseLong(string);
        } catch (NumberFormatException e) {
            System.err.println("Invalid ID: " + string);
            return null;
        }
    }
    @Transactional
public void clearAllTleRelatedData() {
    satelliteRepository.deleteAllSatellites();
    debrisRepository.deleteAllDebris();
    rocketBodyRepository.deleteAllRocketBodies();
    tleRepository.deleteAllTleData();
}

    
}