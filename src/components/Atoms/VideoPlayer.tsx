export default function VideoPlayer({ videolink }: any) {
    return (
        <div className="aspect-video ">
            <iframe className="h-full w-full rounded-md " src={`https://www.youtube.com/embed/${videolink}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"></iframe>
        </div>

    )
}