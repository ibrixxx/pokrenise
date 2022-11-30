package com.ibrahimmesan.motivakcija;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PedometerModule extends ReactContextBaseJavaModule {
    private static Sensor sensor;
    private static float steps = 0;

    PedometerModule(ReactApplicationContext context) {
        super(context);
    }

    public static void setSensor(Sensor sensorInstance) {
        sensor = sensorInstance;
    }

    public static void setSteps(float steps1) {
        steps = steps1;
    }

    @NonNull
    @Override
    public String getName() {
        return "PedometerModule";
    }

    @ReactMethod
    public void getSteps() {
        Log.d("MODULEA", String.valueOf(steps));
    }
}