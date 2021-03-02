// CSS
import '../static/css/style.css';

// React components
import DeviceCard from '../components/device_card';

function Index() {
    var devices = [
        <DeviceCard id="ledstrip_bedroom_south" name="Ledstrip bedroom Cas" description="Hello this is a ledstrip" icon="light" color="FF00FF" active={true} />
    ];

    return (
        <main className="cards">
            { devices }
        </main>
    )
}

export default Index;
