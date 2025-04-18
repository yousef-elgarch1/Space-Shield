package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.model.OrbitPoint;
import org.orekit.bodies.GeodeticPoint;
import org.orekit.bodies.OneAxisEllipsoid;
import org.orekit.frames.Frame;
import org.orekit.frames.FramesFactory;
import org.orekit.propagation.analytical.tle.TLE;
import org.orekit.propagation.analytical.tle.TLEPropagator;
import org.orekit.time.AbsoluteDate;
import org.orekit.utils.Constants;
import org.orekit.utils.PVCoordinates;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrbitService {

    public List<OrbitPoint> computeOrbitFromTle(TleData tle, int durationMinutes) {
        List<OrbitPoint> result = new ArrayList<>();

        try {
            // Build the TLE using the lines stored in the DB
            TLE orekitTle = new TLE(tle.getTleLine1(), tle.getTleLine2());
            TLEPropagator propagator = TLEPropagator.selectExtrapolator(orekitTle);

            Frame inertialFrame = FramesFactory.getEME2000();
            Frame earthFrame = FramesFactory.getITRF(FramesFactory.IERS_2010, true);
            OneAxisEllipsoid earth = new OneAxisEllipsoid(
                    Constants.WGS84_EARTH_EQUATORIAL_RADIUS,
                    Constants.WGS84_EARTH_FLATTENING,
                    earthFrame
            );

            AbsoluteDate start = orekitTle.getDate();

            for (int i = 0; i < durationMinutes; i += 10) {
                AbsoluteDate step = start.shiftedBy(i * 60.0);
                PVCoordinates pv = propagator.propagate(step).getPVCoordinates(inertialFrame);
                GeodeticPoint point = earth.transform(pv.getPosition(), inertialFrame, step);

                result.add(new OrbitPoint(
                        Math.toDegrees(point.getLatitude()),
                        Math.toDegrees(point.getLongitude()),
                        point.getAltitude()
                ));
            }

        } catch (Exception e) {
            System.err.println(" Failed to compute orbit for NORAD ID: " + tle.getNoradCatId());
            e.printStackTrace();
        }

        return result;
    }
}
