export default function Page({ params }: { params: { workspaceId: string } }) {
    return <div>Workspace id : {params.workspaceId}</div>
}
