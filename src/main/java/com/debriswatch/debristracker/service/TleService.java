package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.TleRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.net.http.HttpRequest;

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

    @Autowired
    private TleRepository tleRepository;  //repo ajouter
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()); // For LocalDateTime support
    public void fetchAndProcessTleData() {
        //data to be well stored
        String username = "yousseftouzani2003@gmail.com";
        String password = "Projetdevhamlaoui2025!";
        String loginUrl = "https://www.space-track.org/ajaxauth/login";
        String tleUrl = "https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/format/json";

        try {
            HttpClient client=HttpClient.newHttpClient();

            // Authenticate space track plateform for tle data
            HttpRequest loginRequest = HttpRequest.newBuilder()
                    .uri(URI.create(loginUrl))
                    .POST(HttpRequest.BodyPublishers.ofString("identity=" + username + "&password=" + password))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .build();
            client.send(loginRequest, HttpResponse.BodyHandlers.discarding());

            // Fetch TLE data
            HttpRequest tleRequest = HttpRequest.newBuilder()
                    .uri(URI.create(tleUrl))
                    .build();
            HttpResponse<String> response = client.send(tleRequest, HttpResponse.BodyHandlers.ofString());

            // Parse and store JSON data in the database
            String tleJson = response.body();
            List<TleData> tleDataList = parseTleJson(tleJson);
            tleRepository.saveAll(tleDataList);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private List<TleData> parseTleJson(String tleJson) throws Exception {
        // Configure the ObjectMapper to handle the date format
        objectMapper.findAndRegisterModules();

        // Parse the JSON array into a List of TleData objects
        List<TleData> tleDataList = objectMapper.readValue(tleJson, new TypeReference<List<TleData>>() {});


        for (TleData tleData : tleDataList) {
            if (tleData.getEpoch() != null ) {
                // Convert the String epoch to LocalDateTime if needed
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd ");
                LocalDateTime epoch = LocalDateTime.parse(tleData.getEpoch(), formatter);
                tleData.setEpoch(epoch);
            }
        }
        return tleDataList;
    }
}