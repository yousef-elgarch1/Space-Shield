package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.model.Vector3DPoint;
import com.debriswatch.debristracker.repository.TleRepository;

import org.orekit.bodies.GeodeticPoint;
import org.orekit.bodies.OneAxisEllipsoid;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.orekit.propagation.analytical.tle.TLE;
import org.orekit.propagation.analytical.tle.TLEPropagator;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.Constants;
import org.orekit.utils.PVCoordinates;
import org.orekit.utils.IERSConventions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrbitService {

    private final TleRepository tleRepository;
@Autowired
    public OrbitService(TleRepository tleRepository) {
        this.tleRepository = tleRepository;
    }

    /**
     * Computes the current geodetic (latitude, longitude, altitude) position
     * of a space object based on its TLE using the current system time.
     */
    public OrbitPoint computeCurrentOrbitPoint(TleData tle) {
        try {
            TLE orekitTle = new TLE(tle.getTleLine1(), tle.getTleLine2());
            TLEPropagator propagator = TLEPropagator.selectExtrapolator(orekitTle);

            Frame inertialFrame = FramesFactory.getEME2000();
            Frame earthFrame = FramesFactory.getITRF(IERSConventions.IERS_2010, true);
            OneAxisEllipsoid earth = new OneAxisEllipsoid(
                    Constants.WGS84_EARTH_EQUATORIAL_RADIUS,
                    Constants.WGS84_EARTH_FLATTENING,
                    earthFrame
            );

            AbsoluteDate now = new AbsoluteDate(); // Real-time timestamp
            PVCoordinates pv = propagator.propagate(now).getPVCoordinates(inertialFrame);
            GeodeticPoint point = earth.transform(pv.getPosition(), inertialFrame, now);

            return new OrbitPoint(
                    Math.toDegrees(point.getLatitude()),
                    Math.toDegrees(point.getLongitude()),
                    point.getAltitude()
            );

        } catch (Exception e) {
            System.err.println("Failed to compute current orbit for NORAD ID: " + tle.getNoradCatId());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Computes the current 3D (X, Y, Z) inertial position in meters
     * of a space object based on its TLE using the current system time.
     */
    public Vector3DPoint computeCurrent3DPosition(TleData tle) {
        try {
            TLE orekitTle = new TLE(tle.getTleLine1(), tle.getTleLine2());
            TLEPropagator propagator = TLEPropagator.selectExtrapolator(orekitTle);
            Frame inertialFrame = FramesFactory.getEME2000();

            AbsoluteDate now = new AbsoluteDate(); // Real-time timestamp
            PVCoordinates pv = propagator.propagate(now).getPVCoordinates(inertialFrame);

            return new Vector3DPoint(
                    pv.getPosition().getX(),
                    pv.getPosition().getY(),
                    pv.getPosition().getZ()
            );

        } catch (Exception e) {
            System.err.println("Failed to compute current 3D position for NORAD ID: " + tle.getNoradCatId());
            e.printStackTrace();
            return null;
        }
    }
}
