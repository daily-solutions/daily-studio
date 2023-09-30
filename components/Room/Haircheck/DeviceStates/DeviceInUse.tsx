export function DeviceInUse() {
  return (
    <>
      <h3 className="text-center font-medium">
        Device in use by another application
      </h3>
      <p className="text-center text-sm">
        Close any other applications that might be using your camera or
        microphone and then refresh the page.
      </p>
    </>
  );
}
