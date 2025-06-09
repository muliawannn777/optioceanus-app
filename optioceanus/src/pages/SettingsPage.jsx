import React from "react";
import RouteConfigForm from "../RouteConfigForm";
import ThemedComponent from "../ThemedComponent";

import ShipNameForm from "../ShipNameForm";
function SettingsPage() {
    return (
        <div>
            <h2>Pengaturan Aplikasi</h2>
            <p>Konfigurasikan preferensi aplikasi Anda di sini.</p>
            <ThemedComponent />
            <RouteConfigForm />
            <ShipNameForm />
        </div>
    )
}

export default SettingsPage;