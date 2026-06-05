//
//  ContentView.swift
//  TPPC Watch Watch App
//

import SwiftUI
import Combine

// MARK: - Day

enum ChukkaDay: String, CaseIterable, Identifiable {
    case wed, thu, sat, sun

    var id: String { rawValue }

    var label: String {
        switch self {
        case .wed: return "Wed"
        case .thu: return "Thu"
        case .sat: return "Sat"
        case .sun: return "Sun"
        }
    }

    var fullLabel: String {
        switch self {
        case .wed: return "Wednesday"
        case .thu: return "Thursday"
        case .sat: return "Saturday"
        case .sun: return "Sunday"
        }
    }

    var scheduleKey: String { self == .wed ? "schedule" : "schedule-\(rawValue)" }
    var rosterKey: String { self == .wed ? "roster" : "roster-\(rawValue)" }

    static func upcoming() -> ChukkaDay {
        switch Calendar.current.component(.weekday, from: Date()) {
        case 1:    return .sun
        case 5:    return .thu
        case 6, 7: return .sat
        default:   return .wed
        }
    }
}

// MARK: - Models (match the JSON the web app stores)

struct Player: Codable, Identifiable {
    var id = UUID()
    let name: String
    let handicap: Int?

    enum CodingKeys: String, CodingKey { case name, handicap }

    var display: String {
        if let handicap { return "\(name)  (\(handicap))" }
        return name
    }
}

struct Chukka: Codable, Identifiable {
    let number: Int
    let time: String
    let teamA: [Player]
    let teamB: [Player]

    var id: Int { number }
}

struct Schedule: Codable {
    let chukkas: [Chukka]
}

// MARK: - Firestore REST envelope

private struct FirestoreDocument: Decodable {
    let fields: Fields?
    struct Fields: Decodable { let value: StringValue? }
    struct StringValue: Decodable { let stringValue: String? }
}

// MARK: - Data store (Firestore REST API — no SDK needed)

enum LoadState {
    case loading
    case schedule(Schedule)
    case roster([Player])
    case empty
    case error(String)
}

private let kProjectID = "tedworth-park-polo"
private let kApiKey = "AIzaSyBEPZpBeZLmUQdtzGCY7UCIwnGzP8f1xpQ"

/// Fetches one `shared/<key>` document and returns the inner JSON object the web
/// app stored (already unwrapped from the Firestore string-field envelope), or
/// nil for a missing document.
private func fetchSharedJSON(key: String) async throws -> Any? {
    let path = "https://firestore.googleapis.com/v1/projects/\(kProjectID)/databases/(default)/documents/shared/\(key)?key=\(kApiKey)"
    guard let url = URL(string: path) else { return nil }
    let (data, response) = try await URLSession.shared.data(from: url)
    guard let http = response as? HTTPURLResponse else { return nil }
    if http.statusCode == 404 { return nil }
    guard http.statusCode == 200 else { return nil }
    guard let env = try JSONSerialization.jsonObject(with: data) as? [String: Any],
          let fields = env["fields"] as? [String: Any],
          let value = fields["value"] as? [String: Any],
          let s = value["stringValue"] as? String,
          let inner = s.data(using: .utf8) else { return nil }
    return try JSONSerialization.jsonObject(with: inner)
}

@MainActor
final class ChukkaStore: ObservableObject {
    @Published var state: LoadState

    init() {
        state = .loading
    }

    func load(day: ChukkaDay) {
        state = .loading
        Task { await fetch(day: day) }
    }

    private func fetch(day: ChukkaDay) async {
        do {
            if let schedule = try await getDocument(Schedule.self, key: day.scheduleKey),
               !schedule.chukkas.isEmpty {
                state = .schedule(schedule)
                return
            }
            if let players = try await getDocument([Player].self, key: day.rosterKey),
               !players.isEmpty {
                state = .roster(players)
                return
            }
            state = .empty
        } catch {
            state = .error("No connection")
        }
    }

    private func getDocument<T: Decodable>(_ type: T.Type, key: String) async throws -> T? {
        let path = "https://firestore.googleapis.com/v1/projects/\(kProjectID)/databases/(default)/documents/shared/\(key)?key=\(kApiKey)"
        guard let url = URL(string: path) else { return nil }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse else { return nil }
        if http.statusCode == 404 { return nil }
        guard http.statusCode == 200 else { return nil }

        let document = try JSONDecoder().decode(FirestoreDocument.self, from: data)
        guard let inner = document.fields?.value?.stringValue,
              let innerData = inner.data(using: .utf8) else { return nil }
        return try JSONDecoder().decode(T.self, from: innerData)
    }
}

// MARK: - Root view (Chukkas | Live)

enum AppTab { case chukkas, live }

struct ContentView: View {
    @State private var tab: AppTab = .chukkas

    var body: some View {
        NavigationStack {
            VStack(spacing: 5) {
                TopTabs(selection: $tab)
                switch tab {
                case .chukkas: ChukkasScreen()
                case .live:    LiveScreen()
                }
            }
            .navigationTitle(tab == .live ? "Live" : "Chukkas")
        }
    }
}

struct TopTabs: View {
    @Binding var selection: AppTab
    private let burgundy = Color(red: 0.42, green: 0.12, blue: 0.16)

    var body: some View {
        HStack(spacing: 3) {
            pill("Chukkas", .chukkas)
            pill("Live", .live)
        }
        .padding(.horizontal, 4)
    }

    @ViewBuilder
    private func pill(_ title: String, _ value: AppTab) -> some View {
        Button { selection = value } label: {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 4)
        }
        .buttonStyle(.plain)
        .background(selection == value ? burgundy : Color.gray.opacity(0.25))
        .foregroundColor(selection == value ? .white : .gray)
        .clipShape(RoundedRectangle(cornerRadius: 6))
    }
}

// MARK: - Chukkas screen (the per-day draw)

struct ChukkasScreen: View {
    @StateObject private var store = ChukkaStore()
    @State private var day: ChukkaDay = ChukkaDay.upcoming()
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        VStack(spacing: 5) {
            DayPicker(day: $day)
            ScrollView { content }
        }
        .onChange(of: scenePhase, initial: true) {
            if scenePhase == .active { store.load(day: day) }
        }
        .onChange(of: day) { store.load(day: day) }
    }

    @ViewBuilder
    private var content: some View {
        switch store.state {
        case .loading:
            ProgressView().padding(.top, 24)
        case .error(let message):
            MessageView(title: "Couldn't load", detail: message)
        case .empty:
            MessageView(title: "Nothing booked",
                        detail: "No one is on the \(day.fullLabel) roster yet.")
        case .roster(let players):
            RosterView(players: players, day: day)
        case .schedule(let schedule):
            VStack(spacing: 6) {
                ForEach(schedule.chukkas) { ChukkaCard(chukka: $0) }
            }
            .padding(.horizontal, 4)
            .padding(.bottom, 8)
        }
    }
}

// MARK: - Day picker

struct DayPicker: View {
    @Binding var day: ChukkaDay
    private let burgundy = Color(red: 0.42, green: 0.12, blue: 0.16)

    var body: some View {
        HStack(spacing: 3) {
            ForEach(ChukkaDay.allCases) { option in
                Button {
                    day = option
                } label: {
                    Text(option.label)
                        .font(.system(size: 12, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 4)
                }
                .buttonStyle(.plain)
                .background(day == option ? burgundy : Color.gray.opacity(0.25))
                .foregroundColor(day == option ? .white : .gray)
                .clipShape(RoundedRectangle(cornerRadius: 6))
            }
        }
        .padding(.horizontal, 4)
    }
}

// MARK: - Chukka card

struct ChukkaCard: View {
    let chukka: Chukka

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("Chukka \(chukka.number)")
                    .font(.system(size: 14, weight: .bold))
                Spacer()
                Text(chukka.time)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            TeamRow(label: "Blue", players: chukka.teamA, color: .blue)
            TeamRow(label: "White", players: chukka.teamB, color: .white)
        }
        .padding(8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.gray.opacity(0.18))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

struct TeamRow: View {
    let label: String
    let players: [Player]
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            HStack(spacing: 4) {
                Circle()
                    .fill(color)
                    .frame(width: 7, height: 7)
                Text(label)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(color)
            }
            if players.isEmpty {
                Text("—").font(.system(size: 12)).foregroundColor(.secondary)
            } else {
                ForEach(players) { player in
                    Text(player.display).font(.system(size: 12))
                }
            }
        }
    }
}

// MARK: - Roster fallback

struct RosterView: View {
    let players: [Player]
    let day: ChukkaDay

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("Draw not published yet")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.orange)
            Text("\(players.count) booked for \(day.fullLabel):")
                .font(.system(size: 11))
                .foregroundColor(.secondary)
            ForEach(players) { player in
                Text(player.display).font(.system(size: 13))
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 8)
        .padding(.bottom, 8)
    }
}

// MARK: - Message view

struct MessageView: View {
    let title: String
    let detail: String

    var body: some View {
        VStack(spacing: 6) {
            Text(title).font(.system(size: 14, weight: .semibold))
            Text(detail)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .padding(.top, 12)
    }
}

// MARK: - Live game models (mirror fixtureDetails[fixtureId].days[].matches[])

struct LivePlayer: Identifiable {
    let id = UUID()
    let name: String
    let handicap: Double?
    let goals: Double?
}

struct LiveTeam {
    let name: String
    let handicap: Double?
    let players: [LivePlayer]
}

struct LiveMatch: Identifiable {
    let id: String
    let time: String?
    let label: String?
    let scoreA: Double?
    let scoreB: Double?
    let chukkas: Double?
    let teamA: LiveTeam
    let teamB: LiveTeam

    /// A raw score has been entered = the game is being / has been scored.
    var hasScore: Bool { scoreA != nil || scoreB != nil }
}

struct LiveGameItem: Identifiable {
    let id: String           // fixtureId|dayId|matchId
    let fixtureName: String
    let dateLabel: String?
    let ground: String?
    let match: LiveMatch
}

// MARK: - Lenient JSON helpers

private func anyNum(_ v: Any?) -> Double? {
    if let d = v as? Double { return d }
    if let i = v as? Int { return Double(i) }
    if let n = v as? NSNumber { return n.doubleValue }
    if let s = v as? String { return Double(s) }
    return nil
}

private func anyStr(_ v: Any?) -> String? {
    if let s = v as? String { return s }
    if let n = v as? NSNumber { return n.stringValue }
    return nil
}

private func nm(_ s: String, _ fallback: String) -> String { s.isEmpty ? fallback : s }

// MARK: - Handicap head-start (ports the web app's liveDisplayScore)

private func matchChukkas(_ m: LiveMatch) -> Double {
    let c = m.chukkas ?? 0
    return c > 0 ? c : 4
}

/// Goals given to the lower-handicap team: (|hA - hB| * chukkas) / 6, any
/// fraction counted as half a goal. Returned for the requested side only.
private func headStart(_ m: LiveMatch, teamA: Bool) -> Double {
    let hA = m.teamA.handicap ?? 0
    let hB = m.teamB.handicap ?? 0
    if hA == hB { return 0 }
    let units = abs(hA - hB) * matchChukkas(m)
    let whole = floor(units / 6)
    let goals = whole + (units.truncatingRemainder(dividingBy: 6) > 0 ? 0.5 : 0)
    let lowerIsA = hA < hB
    return (teamA == lowerIsA) ? goals : 0
}

private func displayScore(_ m: LiveMatch, teamA: Bool) -> Double {
    ((teamA ? m.scoreA : m.scoreB) ?? 0) + headStart(m, teamA: teamA)
}

private func fmtHalf(_ n: Double) -> String {
    let whole = Int(floor(n))
    let half = (n - floor(n)) >= 0.5
    if half { return whole == 0 ? "½" : "\(whole)½" }
    return "\(whole)"
}

private func fmtNum(_ n: Double?) -> String? {
    guard let n else { return nil }
    return n == n.rounded() ? String(Int(n)) : String(n)
}

// MARK: - Live store

@MainActor
final class LiveStore: ObservableObject {
    enum Phase { case loading, loaded, error(String) }
    @Published var phase: Phase = .loading
    @Published var items: [LiveGameItem] = []

    func load() { Task { await fetch() } }

    private func fetch() async {
        do {
            async let detailsTask = fetchSharedJSON(key: "fixture-details")
            async let fixturesTask = fetchSharedJSON(key: "fixtures")
            let details = try await detailsTask
            let fixtures = try await fixturesTask
            let names = parseFixtureNames(fixtures)
            items = parseDetails(details, names: names)
            phase = .loaded
        } catch {
            phase = .error("No connection")
        }
    }

    private func parseFixtureNames(_ raw: Any?) -> [String: String] {
        var map: [String: String] = [:]
        if let arr = raw as? [[String: Any]] {
            for f in arr {
                if let id = anyStr(f["id"]) { map[id] = anyStr(f["name"]) ?? id }
            }
        }
        return map
    }

    private func parseTeam(_ t: Any?) -> LiveTeam {
        guard let obj = t as? [String: Any] else {
            return LiveTeam(name: "", handicap: nil, players: [])
        }
        let players = (obj["players"] as? [[String: Any]] ?? []).map {
            LivePlayer(name: anyStr($0["name"]) ?? "",
                       handicap: anyNum($0["handicap"]),
                       goals: anyNum($0["goals"]))
        }
        return LiveTeam(name: anyStr(obj["name"]) ?? "",
                        handicap: anyNum(obj["handicap"]),
                        players: players)
    }

    private func parseMatch(_ m: [String: Any]) -> LiveMatch {
        LiveMatch(id: anyStr(m["id"]) ?? UUID().uuidString,
                  time: anyStr(m["time"]),
                  label: anyStr(m["label"]),
                  scoreA: anyNum(m["scoreA"]),
                  scoreB: anyNum(m["scoreB"]),
                  chukkas: anyNum(m["chukkas"]),
                  teamA: parseTeam(m["teamA"]),
                  teamB: parseTeam(m["teamB"]))
    }

    private func parseDetails(_ raw: Any?, names: [String: String]) -> [LiveGameItem] {
        guard let dict = raw as? [String: Any] else { return [] }
        var out: [LiveGameItem] = []
        for (fid, fv) in dict {
            guard let fobj = fv as? [String: Any] else { continue }
            let fixtureName = names[fid] ?? "Fixture"
            let days = fobj["days"] as? [[String: Any]] ?? []
            for d in days {
                let dayId = anyStr(d["id"]) ?? UUID().uuidString
                let dateLabel = anyStr(d["dateLabel"])
                let ground = anyStr(d["ground"])
                let matches = d["matches"] as? [[String: Any]] ?? []
                for mraw in matches {
                    let match = parseMatch(mraw)
                    out.append(LiveGameItem(id: "\(fid)|\(dayId)|\(match.id)",
                                            fixtureName: fixtureName,
                                            dateLabel: dateLabel,
                                            ground: ground,
                                            match: match))
                }
            }
        }
        out.sort { a, b in
            if a.match.hasScore != b.match.hasScore { return a.match.hasScore }
            let da = a.dateLabel ?? "", db = b.dateLabel ?? ""
            if da != db { return da < db }
            return (a.match.time ?? "") < (b.match.time ?? "")
        }
        return out
    }
}

// MARK: - Live screen

struct LiveScreen: View {
    @StateObject private var store = LiveStore()
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ScrollView { content }
            .onChange(of: scenePhase, initial: true) {
                if scenePhase == .active { store.load() }
            }
            .task {
                // Light auto-refresh while the Live screen is visible.
                while !Task.isCancelled {
                    try? await Task.sleep(nanoseconds: 20_000_000_000)
                    if Task.isCancelled { break }
                    store.load()
                }
            }
    }

    @ViewBuilder
    private var content: some View {
        switch store.phase {
        case .loading:
            ProgressView().padding(.top, 24)
        case .error(let message):
            MessageView(title: "Couldn't load", detail: message)
        case .loaded:
            if store.items.isEmpty {
                MessageView(title: "No live games",
                            detail: "Scores appear here once a match is being scored.")
            } else {
                let live = store.items.filter { $0.match.hasScore }
                let rest = store.items.filter { !$0.match.hasScore }
                VStack(spacing: 6) {
                    if !live.isEmpty {
                        SectionLabel("In play")
                        ForEach(live) { item in
                            NavigationLink { LiveDetail(item: item) } label: { LiveCard(item: item) }
                                .buttonStyle(.plain)
                        }
                    }
                    if !rest.isEmpty {
                        SectionLabel(live.isEmpty ? "Fixtures" : "Not started")
                        ForEach(rest) { item in
                            NavigationLink { LiveDetail(item: item) } label: { LiveCard(item: item) }
                                .buttonStyle(.plain)
                        }
                    }
                }
                .padding(.horizontal, 4)
                .padding(.bottom, 8)
            }
        }
    }
}

struct SectionLabel: View {
    let text: String
    init(_ text: String) { self.text = text }
    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 9, weight: .semibold))
            .foregroundColor(.secondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 2)
    }
}

struct LiveCard: View {
    let item: LiveGameItem

    var body: some View {
        let m = item.match
        VStack(alignment: .leading, spacing: 3) {
            HStack {
                Text(item.fixtureName)
                    .font(.system(size: 11, weight: .semibold))
                    .lineLimit(1)
                Spacer()
                if m.hasScore { Circle().fill(Color.red).frame(width: 6, height: 6) }
            }
            if let label = m.label, !label.isEmpty {
                Text(label + (m.time.map { " · \($0)" } ?? ""))
                    .font(.system(size: 10)).foregroundColor(.secondary).lineLimit(1)
            } else if let t = m.time {
                Text(t).font(.system(size: 10)).foregroundColor(.secondary)
            }
            HStack(spacing: 6) {
                Text(nm(m.teamA.name, "Blue"))
                    .font(.system(size: 12, weight: .medium)).foregroundColor(.blue)
                    .lineLimit(1).frame(maxWidth: .infinity, alignment: .leading)
                if m.hasScore {
                    Text("\(fmtHalf(displayScore(m, teamA: true)))–\(fmtHalf(displayScore(m, teamA: false)))")
                        .font(.system(size: 14, weight: .bold)).monospacedDigit()
                } else {
                    Text("v").font(.system(size: 11)).foregroundColor(.secondary)
                }
                Text(nm(m.teamB.name, "White"))
                    .font(.system(size: 12, weight: .medium))
                    .lineLimit(1).frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
        .padding(8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.gray.opacity(0.18))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

struct LiveDetail: View {
    let item: LiveGameItem

    var body: some View {
        let m = item.match
        let hsA = headStart(m, teamA: true)
        let hsB = headStart(m, teamA: false)
        ScrollView {
            VStack(spacing: 8) {
                Text(item.fixtureName)
                    .font(.system(size: 13, weight: .bold))
                    .multilineTextAlignment(.center)
                if let dl = item.dateLabel {
                    Text(dl + (item.ground.map { " · \($0)" } ?? ""))
                        .font(.system(size: 10)).foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                if let label = m.label, !label.isEmpty {
                    Text(label).font(.system(size: 11, weight: .semibold)).foregroundColor(.orange)
                }

                HStack(alignment: .top, spacing: 8) {
                    VStack(spacing: 2) {
                        Text(nm(m.teamA.name, "Blue"))
                            .font(.system(size: 11, weight: .semibold)).foregroundColor(.blue)
                            .lineLimit(2).multilineTextAlignment(.center)
                        Text(fmtHalf(displayScore(m, teamA: true)))
                            .font(.system(size: 30, weight: .bold)).monospacedDigit()
                    }
                    .frame(maxWidth: .infinity)
                    Text("–").font(.system(size: 20, weight: .bold)).foregroundColor(.secondary)
                    VStack(spacing: 2) {
                        Text(nm(m.teamB.name, "White"))
                            .font(.system(size: 11, weight: .semibold))
                            .lineLimit(2).multilineTextAlignment(.center)
                        Text(fmtHalf(displayScore(m, teamA: false)))
                            .font(.system(size: 30, weight: .bold)).monospacedDigit()
                    }
                    .frame(maxWidth: .infinity)
                }

                if hsA > 0 || hsB > 0 {
                    let side = hsA > 0 ? nm(m.teamA.name, "Blue") : nm(m.teamB.name, "White")
                    Text("incl. \(fmtHalf(max(hsA, hsB))) on handicap to \(side)")
                        .font(.system(size: 9)).foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }

                PlayerGoals(team: m.teamA, fallback: "Blue", color: .blue)
                PlayerGoals(team: m.teamB, fallback: "White", color: .white)

                if !m.hasScore {
                    Text("Not started yet").font(.system(size: 10)).foregroundColor(.secondary)
                }
            }
            .padding(8)
        }
        .navigationTitle("Live")
    }
}

struct PlayerGoals: View {
    let team: LiveTeam
    let fallback: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(spacing: 4) {
                Circle().fill(color).frame(width: 7, height: 7)
                Text(nm(team.name, fallback))
                    .font(.system(size: 11, weight: .semibold)).foregroundColor(color)
                if let h = fmtNum(team.handicap) {
                    Spacer()
                    Text("h'cap \(h)").font(.system(size: 9)).foregroundColor(.secondary)
                }
            }
            if team.players.isEmpty {
                Text("—").font(.system(size: 11)).foregroundColor(.secondary)
            } else {
                ForEach(team.players) { p in
                    HStack {
                        Text(nm(p.name, "—")).font(.system(size: 12)).lineLimit(1)
                        Spacer()
                        if let g = fmtNum(p.goals), g != "0" {
                            Text(g).font(.system(size: 12, weight: .semibold)).foregroundColor(.orange)
                        }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(8)
        .background(Color.gray.opacity(0.15))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}
