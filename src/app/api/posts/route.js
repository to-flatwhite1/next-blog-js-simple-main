import { NextResponse } from 'next/server';
// MongoDB 연결을 위한 유틸리티 함수 가져오기
import connectDB from '@/lib/mongodb';
import Post from '@/model/Post';
// MongoDB의 Post 모델 가져오기

export async function GET() {
    try {
        // MongoDB 연결
        await connectDB();
        // Post 모델을 사용해 모든 게시글을 찾고, 생성일 기준 내림차순 정렬
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // MongoDB 연결
        await connectDB();
        const data = await req.json();

        if (!data.title || !data.content) {
            return NextResponse.json({ error: '제목과 내용은 필수입니다.' }, { status: 400 });
        }

        // Post 모델을 사용해 새 게시글 생성
        const post = await Post.create(data);
        // 클라이언트 응답
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: '게시글 작성에 실패했습니다.' }, { status: 500 });
    }
}
