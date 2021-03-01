import Device from '../components/device_card';

function Index() {
    var devices = [
        <Device name="hello" />
    ];

    return (
        <main>
            { devices }
        </main>
    )
}

export default Index;
