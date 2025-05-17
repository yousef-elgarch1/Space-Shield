package com.debriswatch.debristracker.fetcher;

import java.util.List;

import com.debriswatch.debristracker.model.TleData;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;


public abstract class TleFetcher {

    public final void fetchAndProcess() throws Exception {
        authenticate();
        String json = fetchRawData();
        List<TleData> tleList = parseTleJson(json);
        saveTleData(tleList);
    }

    protected abstract void authenticate() throws Exception;
    protected abstract String fetchRawData() throws Exception;
    protected abstract void saveTleData(List<TleData> tleList);

    protected List<TleData> parseTleJson(String json) throws Exception {
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        return mapper.readValue(json, new TypeReference<>() {});
    }
}


