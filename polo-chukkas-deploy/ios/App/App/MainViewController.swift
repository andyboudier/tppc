import UIKit
import Capacitor

// The app's own bridge view controller (Main.storyboard names it), so plugins
// written inside the app can be registered. Capacitor 8 registers the npm
// plugins by itself, from capacitor.config.json's packageClassList, but an
// in-app plugin is not in that list: without this, LiveScoreActivityPlugin was
// never registered, and the live-score Live Activity could not start.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(LiveScoreActivityPlugin())
    }
}
