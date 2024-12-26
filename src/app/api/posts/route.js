import { NextResponse } from 'next/server';
import { posts } from '@/data/posts';

// 전체 글 조회 - GET 요청 처리
export async function GET() {
    // 성공
    try {
        return NextResponse.json(posts);
    } catch (error) {
        // 실패
        return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
    }
}

// 글 생성 - POST 요청 처리
export async function POST(req) {
    try {
        // data = { title: '새 제목', content: '새 내용' }
        const data = await req.json();

        // 제목이나 내용이 없는 경우
        if (!data.title || !data.content) {
            return NextResponse.json(
                { error: '제목과 내용은 필수입니다.' },
                { status: 400 } // Bad Request
            );
        }

        // newPost 객체 생성
        const newPost = {
            id: posts.length + 1,
            title: data.title,
            content: data.content,
            createdAt: new Date().toLocaleDateString(),
        };

        // 서버의 데이터 베이스(posts)에 데이터 추가
        posts.push(newPost);

        // 클라이언트에게 새 글을 응답
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: '게시글을 생성하는데 실패했습니다.' }, { status: 500 });
    }
}
