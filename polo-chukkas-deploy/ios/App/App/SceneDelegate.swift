import UIKit
import Capacitor

// iOS 27 stops any app built with its SDK that has not adopted the scene
// lifecycle, at launch (UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption).
// Info.plist's UIApplicationSceneManifest names this class and Main.storyboard,
// so UIKit builds the window and the CAPBridgeViewController from the
// storyboard as before; this only passes the scene's events on to Capacitor,
// which hands them to plugins the way the AppDelegate's openURL and
// continueUserActivity did.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}
