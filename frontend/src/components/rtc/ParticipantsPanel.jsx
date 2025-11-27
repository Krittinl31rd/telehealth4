import { Mic, MicOff, Video, VideoOff, X, User, Users } from "lucide-react";

export default function ParticipantsPanel({
  isOpen,
  onClose,
  localID = "",
  loaclName = "",
  peers,
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-base-100 shadow-lg transform transition-transform duration-300 z-50 rounded-tl-md rounded-bl-md ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-2 border-b ">
        <div className="flex-1 flex items-center gap-2 text-lg font-semibold">
          <Users />
          Participants
        </div>
        <button onClick={onClose} className="btn btn-ghost">
          <X />
        </button>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto h-full mr-1 bg-base-200">
        <div className="w-full flex items-center gap-2">
          <User />
          <span className="truncate">{loaclName.slice(0, 5)}</span>
          <span className="font-bold">(Me)</span>
        </div>

        {Object.entries(peers).map(([id, { username, hasAudio, hasVideo }]) => (
          <div key={id} className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-2">
              <User />
              <span className="truncate"> {username.slice(0, 5)}</span>
            </div>
            <div className="flex gap-2">
              {hasAudio ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4 text-red-500" />
              )}
              {hasVideo ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
