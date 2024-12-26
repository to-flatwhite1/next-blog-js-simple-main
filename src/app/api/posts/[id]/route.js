import { posts } from '@/data/posts';
import { NextResponse } from 'next/server';

// 특정 게시글 조회 - GET
export async function GET(req, { params }) {
    // params = { id : '1' }
    // params.id = '1'
    // parseInt(params.id) = 1
    try {
        // id에 해당하는 게시글 찾기
        const post = posts.find((p) => {
            // p = { id: 1, ...}
            return p.id === parseInt(params.id);
        });

        // 게시글이 없을 경우 404 응답
        if (!post) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
    }
}

// 특정 게시글 수정 - PUT
export async function PUT(req, { params }) {
    try {
        const data = await req.json();
        // data = { title: '수정된 제목', content: '수정된 내용' }

        // id에 해당하는 게시글 찾기
        const index = posts.findIndex((p) => {
            return p.id === parseInt(params.id);
        });

        // 게시글이 없을 경우 404 응답
        if (index === -1) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 게시글 업데이트
        posts[index] = {
            ...posts[index],
            title: data.title || posts[index].title,
            content: data.content || posts[index].content,
        };

        return NextResponse.json(posts[index], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: '게시글을 수정하는데 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        // id에 해당하는 게시글의 인덱스 번호 찾기
        const index = posts.findIndex((p) => {
            return p.id === parseInt(params.id);
        });

        // 게시글이 없을 경우 404 응답
        if (index === -1) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 서버의 데이터 베이스(posts) 글 삭제
        posts.splice(index, 1);

        // 클라이언트 응답
        return NextResponse.json({ message: '게시글이 삭제되었습니다.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: '게시글을 삭제하는데 실패했습니다.' }, { status: 500 });
    }
}
