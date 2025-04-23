package com.debriswatch.debristracker.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.debriswatch.debristracker.dto.OrbitResponseDto;
import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.TleRepository;
import com.debriswatch.debristracker.service.OrbitService;

@RestController
@RequestMapping("/api/orbit")
public class OrbitController {

    private final OrbitService orbitService;
    private final TleRepository tleRepository;

    public OrbitController(OrbitService orbitService, TleRepository tleRepository) {
        this.orbitService = orbitService;
        this.tleRepository = tleRepository;
    }

    @GetMapping("/realtime")
    public List<OrbitResponseDto> getRealTimeOrbits() {
        List<TleData> tleList = tleRepository.findLatestTlePerObjectName();

        return tleList.stream()
                .map(tle -> {
                    OrbitPoint point = orbitService.computeCurrentOrbitPoint(tle);
                    if (point != null) {
                        return new OrbitResponseDto(
                                tle.getObjectName(),
                                point.getLatitude(),
                                point.getLongitude(),
                                point.getAltitude()
                        );
                    } else {
                        return null; // filtered below
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }
}

