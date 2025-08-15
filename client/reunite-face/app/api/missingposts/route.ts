export async function POST(request: Request) {
    const formData = await request.formData()
    console.log('API NEXTJS',formData)
    return new Response(JSON.stringify({ message: 'TEST SUCCESS' }), {status: 200})
}