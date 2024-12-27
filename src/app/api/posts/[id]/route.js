// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';

// MongoDB의 ObjectId 검증을 위한 mongoose import
import mongoose from 'mongoose';
// MongoDB 연결을 위한 유틸리티 함수 가져오기
import connectDB from '@/lib/mongodb';
import Post from '@/model/Post';

// MongoDB의 ObjectId가 유효한지 검사하는 함수
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//특정 게시글 조회 GET
export async function GET(req, { params }) {
    try {
        // MongoDB 연결
        await connectDB();

        // Next.js 13에서는 params를 비동기로 처리하도록 변경되었다.
        // 일반 값을 Promise로 변환
        // const regular = 1;
        // const promise = Promise.resolve(regular); // Promise { 1 }
        // Promise의 결과값을 추출
        // const result = await promise; // 1
        const resolvedParams = await Promise.resolve(params);

        // 게시글 ID가 유효한 MongoDB ObjectId 형식인지 검사
        if (!isValidObjectId(resolvedParams.id)) {
            return NextResponse.json({ error: '유효하지 않은 게시글 ID입니다.' }, { status: 400 });
        }

        // Post 모델을 사용해 특정 ID의 게시글 찾기
        const post = await Post.findById(resolvedParams.id);
        if (!post) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        // MongoDB 연결
        await connectDB();
        const resolvedParams = await Promise.resolve(params);

        if (!isValidObjectId(resolvedParams.id)) {
            return NextResponse.json({ error: '유효하지 않은 게시글 ID입니다.' }, { status: 400 });
        }

        const data = await req.json();
        const post = await Post.findByIdAndUpdate(
            resolvedParams.id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!post) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error('PUT 요청 에러:', error); // 에러 확인
        return NextResponse.json({ error: '게시글 수정에 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        // MongoDB 연결
        await connectDB();
        const resolvedParams = await Promise.resolve(params);

        // ID 유효성 검사
        if (!isValidObjectId(resolvedParams.id)) {
            return NextResponse.json({ error: '유효하지 않은 게시글 ID입니다.' }, { status: 400 });
        }

        // findByIdAndDelete: ID로 게시글을 찾아 삭제
        const post = await Post.findByIdAndDelete(resolvedParams.id);
        if (!post) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 });
    }
}
