"use client";

import { useState, useEffect } from "react";
import { Volume2, RotateCw, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen, Award, RefreshCw, Send, LoaderCircle, Lock } from "lucide-react";
import type { JsonResponse } from "@/lib/types";
import { VocabMatching } from "@/components/vocab-matching";

export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  typeVi: string;
  imageUrl?: string;
}

export const TEST1_VOCABULARY: VocabItem[] = [
  { id: 1, word: "garden", phonetic: "/ˈɡɑː.dən/", type: "noun", meaning: "khu vườn", example: "The children are playing in the garden.", typeVi: "danh từ" },
  { id: 2, word: "bedroom", phonetic: "/ˈbed.ruːm/", type: "noun", meaning: "phòng ngủ", example: "Tom and Mia are in their bedroom.", typeVi: "danh từ" },
  { id: 3, word: "sleeping", phonetic: "/ˈsliː.pɪŋ/", type: "verb", meaning: "đang ngủ", example: "Dad is sleeping on the deck chair.", typeVi: "động từ" },
  { id: 4, word: "camera", phonetic: "/ˈkæm.rə/", type: "noun", meaning: "máy ảnh", example: "The girl is taking a photo with a camera.", typeVi: "danh từ" },
  { id: 5, word: "teddy bear", phonetic: "/ˈted.i beər/", type: "noun", meaning: "gấu bông", example: "The boy is putting a teddy bear on Dad.", typeVi: "danh từ" },
  { id: 6, word: "photo", phonetic: "/ˈfəʊ.təʊ/", type: "noun", meaning: "bức ảnh", example: "Who is taking a photo?", typeVi: "danh từ" },
  { id: 7, word: "shorts", phonetic: "/ʃɔːts/", type: "noun", meaning: "quần đùi / quần ngắn", example: "Where are the shorts? Over there.", typeVi: "danh từ" },
  { id: 8, word: "shirts", phonetic: "/ʃɜːts/", type: "noun", meaning: "áo sơ mi", example: "He is wearing clean shirts.", typeVi: "danh từ" },
  { id: 9, word: "tent", phonetic: "/tent/", type: "noun", meaning: "lều cắm trại", example: "Is the teapot near the tent?", typeVi: "danh từ" },
  { id: 10, word: "teapot", phonetic: "/ˈtiː.pɒt/", type: "noun", meaning: "ấm trà", example: "The teapot is on the table.", typeVi: "danh từ" },
  { id: 11, word: "thirteen", phonetic: "/ˌθɜːˈtiːn/", type: "number", meaning: "số 13", example: "How old is your brother? He's thirteen.", typeVi: "số đếm" },
  { id: 12, word: "fourteen", phonetic: "/ˌfɔːˈtiːn/", type: "number", meaning: "số 14", example: "What number is it? It's fourteen.", typeVi: "số đếm" },
  { id: 13, word: "fifteen", phonetic: "/ˌfɪfˈtiːn/", type: "number", meaning: "số 15", example: "What number is it? It's fifteen.", typeVi: "số đếm" },
  { id: 14, word: "brother", phonetic: "/ˈbrʌð.ər/", type: "noun", meaning: "anh / em trai", example: "My brother is thirteen years old.", typeVi: "danh từ" },
  { id: 15, word: "sister", phonetic: "/ˈsɪs.tər/", type: "noun", meaning: "chị / em gái", example: "How old is your sister? She's eight.", typeVi: "danh từ" },
  { id: 16, word: "children", phonetic: "/ˈtʃɪl.drən/", type: "noun", meaning: "trẻ em / các con", example: "How many children are there?", typeVi: "danh từ" },
  { id: 17, word: "family", phonetic: "/ˈfæm.əl.i/", type: "noun", meaning: "gia đình", example: "Where is the family? In the garden.", typeVi: "danh từ" },
  { id: 18, word: "table", phonetic: "/ˈteɪ.bəl/", type: "noun", meaning: "cái bàn", example: "What is on the table?", typeVi: "danh từ" },
  { id: 19, word: "chair", phonetic: "/tʃeər/", type: "noun", meaning: "cái ghế", example: "Dad is on the deck chair.", typeVi: "danh từ" },
  { id: 20, word: "ball", phonetic: "/bɔːl/", type: "noun", meaning: "quả bóng", example: "The soccer ball is on the grass.", typeVi: "danh từ" },
  { id: 21, word: "robot", phonetic: "/ˈrəʊ.bɒt/", type: "noun", meaning: "người máy / rô-bốt", example: "I have a cool red robot.", typeVi: "danh từ" },
  { id: 22, word: "monster", phonetic: "/ˈmɒn.stər/", type: "noun", meaning: "con quái vật", example: "The green monster is friendly.", typeVi: "danh từ" },
  { id: 23, word: "spider", phonetic: "/ˈspaɪ.dər/", type: "noun", meaning: "con nhện", example: "There is a small spider on the wall.", typeVi: "danh từ" },
  { id: 24, word: "frog", phonetic: "/frɒɡ/", type: "noun", meaning: "con ếch", example: "The green frog can jump high.", typeVi: "danh từ" },
  { id: 25, word: "bird", phonetic: "/bɜːd/", type: "noun", meaning: "con chim", example: "The bird is singing in the tree.", typeVi: "danh từ" },
  { id: 26, word: "lizard", phonetic: "/ˈlɪz.əd/", type: "noun", meaning: "con thằn lằn", example: "Look at the quick lizard.", typeVi: "danh từ" },
  { id: 27, word: "bookcase", phonetic: "/ˈbʊk.keɪs/", type: "noun", meaning: "tủ sách", example: "The book is in the bookcase.", typeVi: "danh từ" },
  { id: 28, word: "door", phonetic: "/dɔːr/", type: "noun", meaning: "cửa ra vào", example: "Open the door, please.", typeVi: "danh từ" },
  { id: 29, word: "window", phonetic: "/ˈwɪn.dəʊ/", type: "noun", meaning: "cửa sổ", example: "Look out of the bedroom window.", typeVi: "danh từ" },
  { id: 30, word: "picture", phonetic: "/ˈpɪk.tʃər/", type: "noun", meaning: "bức tranh", example: "There is a picture on the wall.", typeVi: "danh từ" },
];

const VOCAB2_STORAGE_BASE = "https://syghsisooccdvpvshgvm.supabase.co/storage/v1/object/public/quiz-assets/vocab-test-2";

export const VOCAB2_IMAGES = {
  get_up: `${VOCAB2_STORAGE_BASE}/get_up.jpg`,
  brush_teeth: `${VOCAB2_STORAGE_BASE}/brush_teeth.jpg`,
  go_to_school: `${VOCAB2_STORAGE_BASE}/go_to_school.jpg`,
  go_to_bed: `${VOCAB2_STORAGE_BASE}/go_to_bed.jpg`,
  have_breakfast: `${VOCAB2_STORAGE_BASE}/have_breakfast.jpg`,
  have_lunch: `${VOCAB2_STORAGE_BASE}/have_lunch.jpg`,
  have_dinner: `${VOCAB2_STORAGE_BASE}/have_dinner.jpg`,
  take_a_shower: `${VOCAB2_STORAGE_BASE}/take_a_shower.jpg`,
  go_to_the_park: `${VOCAB2_STORAGE_BASE}/go_to_the_park.jpg`,
  play_with_friends: `${VOCAB2_STORAGE_BASE}/play_with_friends.jpg`,
  watch_tv: `${VOCAB2_STORAGE_BASE}/watch_tv.jpg`,
  read_a_book: `${VOCAB2_STORAGE_BASE}/read_a_book.jpg`,
  listen_to_music: `${VOCAB2_STORAGE_BASE}/listen_to_music.jpg`,
};

export const TEST2_VOCABULARY: VocabItem[] = [
  { id: 1, word: "get up", phonetic: "/ɡɛt ʌp/", type: "verb", meaning: "thức dậy", example: "I get up early at 6 o'clock every morning.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.get_up },
  { id: 2, word: "brush one's teeth", phonetic: "/brʌʃ wʌnz tiːθ/", type: "verb", meaning: "đánh răng", example: "Remember to brush your teeth after meals.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.brush_teeth },
  { id: 3, word: "go to school", phonetic: "/ɡəʊ tə skuːl/", type: "verb", meaning: "đi đến trường", example: "The children go to school by bus every day.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.go_to_school },
  { id: 4, word: "go to bed", phonetic: "/ɡəʊ tə bɛd/", type: "verb", meaning: "đi ngủ", example: "It is 10 o'clock, time to go to bed.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.go_to_bed },
  { id: 5, word: "have breakfast", phonetic: "/hæv ˈbrɛkfəst/", type: "verb", meaning: "ăn sáng", example: "We have breakfast with bread, eggs and milk.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.have_breakfast },
  { id: 6, word: "have lunch", phonetic: "/hæv lʌntʃ/", type: "verb", meaning: "ăn trưa", example: "They have lunch at the school canteen.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.have_lunch },
  { id: 7, word: "have dinner", phonetic: "/hæv ˈdɪnər/", type: "verb", meaning: "ăn tối", example: "My family has dinner together at 7 p.m.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.have_dinner },
  { id: 8, word: "take a shower", phonetic: "/teɪk ə ˈʃaʊər/", type: "verb", meaning: "tắm", example: "I take a shower after playing sports.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.take_a_shower },
  { id: 9, word: "go to the park", phonetic: "/ɡəʊ tə ðə pɑːk/", type: "verb", meaning: "đi đến công viên", example: "On Sundays, we go to the park to play.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.go_to_the_park },
  { id: 10, word: "play with friends", phonetic: "/pleɪ wɪð frɛndz/", type: "verb", meaning: "chơi với bạn bè", example: "After school, I like to play with friends.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.play_with_friends },
  { id: 11, word: "watch TV", phonetic: "/wɒtʃ tiːˈviː/", type: "verb", meaning: "xem TV", example: "The children watch TV in the living room.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.watch_tv },
  { id: 12, word: "read a book", phonetic: "/riːd ə bʊk/", type: "verb", meaning: "đọc sách", example: "She likes to read a book before sleeping.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.read_a_book },
  { id: 13, word: "listen to music", phonetic: "/ˈlɪsən tə ˈmjuːzɪk/", type: "verb", meaning: "nghe nhạc", example: "I listen to music when I do my art project.", typeVi: "động từ", imageUrl: VOCAB2_IMAGES.listen_to_music },
  { id: 14, word: "play a game", phonetic: "/pleɪ ə ɡeɪm/", type: "verb", meaning: "chơi trò chơi", example: "Let's play a game together on the weekend.", typeVi: "động từ" },
  { id: 15, word: "do homework", phonetic: "/duː ˈhəʊmˌwɜːk/", type: "verb", meaning: "làm bài tập", example: "He does homework in his bedroom after dinner.", typeVi: "động từ" },
  { id: 16, word: "ride a bike", phonetic: "/raɪd ə baɪk/", type: "verb", meaning: "đi xe đạp", example: "Tom rides a bike in the park every afternoon.", typeVi: "động từ" },
  { id: 17, word: "go to the supermarket", phonetic: "/ɡəʊ tə ðə ˈsuːpəmɑːrkɪt/", type: "verb", meaning: "đi siêu thị", example: "Mom and I go to the supermarket to buy food.", typeVi: "động từ" },
  { id: 18, word: "clean the house", phonetic: "/kliːn ðə haʊs/", type: "verb", meaning: "dọn nhà", example: "We clean the house together on Saturday.", typeVi: "động từ" },
  { id: 19, word: "water the plants", phonetic: "/ˈwɔːtər ðə plɑːnts/", type: "verb", meaning: "tưới cây", example: "She waters the plants in the garden every morning.", typeVi: "động từ" },
  { id: 20, word: "feed the pets", phonetic: "/fiːd ðə pɛts/", type: "verb", meaning: "cho thú cưng ăn", example: "Don't forget to feed the pets before going out.", typeVi: "động từ" },
  { id: 21, word: "go shopping", phonetic: "/ɡəʊ ˈʃɒpɪŋ/", type: "verb", meaning: "đi mua sắm", example: "They go shopping for new clothes and toys.", typeVi: "động từ" },
  { id: 22, word: "help parents", phonetic: "/hɛlp ˈpeərənts/", type: "verb", meaning: "giúp đỡ cha mẹ", example: "Good children always help parents with house chores.", typeVi: "động từ" },
  { id: 23, word: "make the bed", phonetic: "/meɪk ðə bɛd/", type: "verb", meaning: "dọn giường", example: "I make the bed right after waking up.", typeVi: "động từ" },
  { id: 24, word: "take out the trash", phonetic: "/teɪk aʊt ðə træʃ/", type: "verb", meaning: "đổ rác", example: "Please take out the trash in the evening.", typeVi: "động từ" },
  { id: 25, word: "go for a walk", phonetic: "/ɡəʊ fɔːr ə wɔːk/", type: "verb", meaning: "đi dạo", example: "Grandpa goes for a walk around the lake.", typeVi: "động từ" },
  { id: 26, word: "go to the library", phonetic: "/ɡəʊ tə ðə ˈlaɪbrəri/", type: "verb", meaning: "đi thư viện", example: "We go to the library to read English storybooks.", typeVi: "động từ" },
  { id: 27, word: "make lunch", phonetic: "/meɪk lʌntʃ/", type: "verb", meaning: "làm bữa trưa", example: "Dad helps mom make lunch on Sunday.", typeVi: "động từ" },
  { id: 28, word: "make breakfast", phonetic: "/meɪk ˈbrɛkfəst/", type: "verb", meaning: "làm bữa sáng", example: "Mom makes breakfast with pancakes and orange juice.", typeVi: "động từ" },
  { id: 29, word: "play football", phonetic: "/pleɪ ˈfʊtbɔːl/", type: "verb", meaning: "chơi bóng đá", example: "The boys play football on the playground.", typeVi: "động từ" },
  { id: 30, word: "play tennis", phonetic: "/pleɪ ˈtɛnɪs/", type: "verb", meaning: "chơi quần vợt", example: "They play tennis at the sports club every afternoon.", typeVi: "động từ" },
];

export interface VocabQuestion {
  id: number;
  prompt: string;
  type: "eng_to_vi" | "vi_to_eng" | "image_choice";
  options: { key: string; text?: string; imageUrl?: string; caption?: string }[];
  correctKey: string;
  targetWord: string;
  targetMeaning: string;
}

export const TEST2_IMAGE_QUESTIONS: VocabQuestion[] = [
  {
    id: 1,
    prompt: 'Bức tranh nào thể hiện: "get up"?',
    type: "image_choice",
    targetWord: "get up",
    targetMeaning: "thức dậy",
    correctKey: "a",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.get_up, caption: "Thức dậy vươn vai" },
      { key: "b", imageUrl: VOCAB2_IMAGES.go_to_bed, caption: "Đi ngủ" },
      { key: "c", imageUrl: VOCAB2_IMAGES.take_a_shower, caption: "Đi tắm" },
    ],
  },
  {
    id: 2,
    prompt: 'Bức tranh nào thể hiện: "brush one\'s teeth"?',
    type: "image_choice",
    targetWord: "brush one's teeth",
    targetMeaning: "đánh răng",
    correctKey: "b",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.take_a_shower, caption: "Đi tắm" },
      { key: "b", imageUrl: VOCAB2_IMAGES.brush_teeth, caption: "Đánh răng" },
      { key: "c", imageUrl: VOCAB2_IMAGES.have_breakfast, caption: "Ăn sáng" },
    ],
  },
  {
    id: 3,
    prompt: 'Bức tranh nào thể hiện: "go to school"?',
    type: "image_choice",
    targetWord: "go to school",
    targetMeaning: "đi đến trường",
    correctKey: "c",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.go_to_the_park, caption: "Đi công viên" },
      { key: "b", imageUrl: VOCAB2_IMAGES.play_with_friends, caption: "Chơi với bạn" },
      { key: "c", imageUrl: VOCAB2_IMAGES.go_to_school, caption: "Đi đến trường" },
    ],
  },
  {
    id: 4,
    prompt: 'Bức tranh nào thể hiện: "go to bed"?',
    type: "image_choice",
    targetWord: "go to bed",
    targetMeaning: "đi ngủ",
    correctKey: "a",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.go_to_bed, caption: "Đi ngủ" },
      { key: "b", imageUrl: VOCAB2_IMAGES.get_up, caption: "Thức dậy" },
      { key: "c", imageUrl: VOCAB2_IMAGES.read_a_book, caption: "Đọc sách" },
    ],
  },
  {
    id: 5,
    prompt: 'Bức tranh nào thể hiện: "have breakfast"?',
    type: "image_choice",
    targetWord: "have breakfast",
    targetMeaning: "ăn sáng",
    correctKey: "b",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.have_lunch, caption: "Ăn trưa" },
      { key: "b", imageUrl: VOCAB2_IMAGES.have_breakfast, caption: "Ăn sáng" },
      { key: "c", imageUrl: VOCAB2_IMAGES.have_dinner, caption: "Ăn tối" },
    ],
  },
  {
    id: 6,
    prompt: 'Bức tranh nào thể hiện: "have lunch"?',
    type: "image_choice",
    targetWord: "have lunch",
    targetMeaning: "ăn trưa",
    correctKey: "a",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.have_lunch, caption: "Ăn trưa" },
      { key: "b", imageUrl: VOCAB2_IMAGES.have_breakfast, caption: "Ăn sáng" },
      { key: "c", imageUrl: VOCAB2_IMAGES.watch_tv, caption: "Xem TV" },
    ],
  },
  {
    id: 7,
    prompt: 'Bức tranh nào thể hiện: "have dinner"?',
    type: "image_choice",
    targetWord: "have dinner",
    targetMeaning: "ăn tối",
    correctKey: "c",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.watch_tv, caption: "Xem TV" },
      { key: "b", imageUrl: VOCAB2_IMAGES.read_a_book, caption: "Đọc sách" },
      { key: "c", imageUrl: VOCAB2_IMAGES.have_dinner, caption: "Ăn tối cùng gia đình" },
    ],
  },
  {
    id: 8,
    prompt: 'Bức tranh nào thể hiện: "take a shower"?',
    type: "image_choice",
    targetWord: "take a shower",
    targetMeaning: "tắm",
    correctKey: "a",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.take_a_shower, caption: "Đi tắm" },
      { key: "b", imageUrl: VOCAB2_IMAGES.brush_teeth, caption: "Đánh răng" },
      { key: "c", imageUrl: VOCAB2_IMAGES.go_to_bed, caption: "Đi ngủ" },
    ],
  },
  {
    id: 9,
    prompt: 'Bức tranh nào thể hiện: "go to the park"?',
    type: "image_choice",
    targetWord: "go to the park",
    targetMeaning: "đi đến công viên",
    correctKey: "b",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.go_to_school, caption: "Đi học" },
      { key: "b", imageUrl: VOCAB2_IMAGES.go_to_the_park, caption: "Đi công viên" },
      { key: "c", imageUrl: VOCAB2_IMAGES.listen_to_music, caption: "Nghe nhạc" },
    ],
  },
  {
    id: 10,
    prompt: 'Bức tranh nào thể hiện: "play with friends"?',
    type: "image_choice",
    targetWord: "play with friends",
    targetMeaning: "chơi với bạn bè",
    correctKey: "a",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.play_with_friends, caption: "Chơi với bạn bè" },
      { key: "b", imageUrl: VOCAB2_IMAGES.watch_tv, caption: "Xem TV" },
      { key: "c", imageUrl: VOCAB2_IMAGES.read_a_book, caption: "Đọc sách" },
    ],
  },
  {
    id: 11,
    prompt: 'Bức tranh nào thể hiện: "watch TV"?',
    type: "image_choice",
    targetWord: "watch TV",
    targetMeaning: "xem TV",
    correctKey: "c",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.listen_to_music, caption: "Nghe nhạc" },
      { key: "b", imageUrl: VOCAB2_IMAGES.read_a_book, caption: "Đọc sách" },
      { key: "c", imageUrl: VOCAB2_IMAGES.watch_tv, caption: "Xem TV" },
    ],
  },
  {
    id: 12,
    prompt: 'Bức tranh nào thể hiện: "read a book"?',
    type: "image_choice",
    targetWord: "read a book",
    targetMeaning: "đọc sách",
    correctKey: "a",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.read_a_book, caption: "Đọc sách" },
      { key: "b", imageUrl: VOCAB2_IMAGES.watch_tv, caption: "Xem TV" },
      { key: "c", imageUrl: VOCAB2_IMAGES.listen_to_music, caption: "Nghe nhạc" },
    ],
  },
  {
    id: 13,
    prompt: 'Bức tranh nào thể hiện: "listen to music"?',
    type: "image_choice",
    targetWord: "listen to music",
    targetMeaning: "nghe nhạc",
    correctKey: "b",
    options: [
      { key: "a", imageUrl: VOCAB2_IMAGES.play_with_friends, caption: "Chơi với bạn" },
      { key: "b", imageUrl: VOCAB2_IMAGES.listen_to_music, caption: "Nghe nhạc" },
      { key: "c", imageUrl: VOCAB2_IMAGES.watch_tv, caption: "Xem TV" },
    ],
  },
];

export function generateVocabQuestions(vocabList: VocabItem[] = TEST1_VOCABULARY): VocabQuestion[] {
  const questions: VocabQuestion[] = [];

  // 20 Questions Eng -> Vi
  vocabList.slice(0, 20).forEach((item, index) => {
    const distractors = vocabList
      .filter((v) => v.id !== item.id)
      .sort(() => (index % 2 === 0 ? 0.5 - Math.random() : -0.5 + Math.random()))
      .map((v) => v.meaning)
      .slice(0, 3);

    const choices = [item.meaning, ...distractors].sort(() => 0.5 - Math.random());
    const keys = ["a", "b", "c", "d"];
    const options = choices.map((c, i) => ({ key: keys[i], text: c }));
    const correctOpt = options.find((o) => o.text === item.meaning)!;

    questions.push({
      id: index + 1,
      prompt: `Nghĩa tiếng Việt của từ "${item.word}" là gì?`,
      type: "eng_to_vi",
      options,
      correctKey: correctOpt.key,
      targetWord: item.word,
      targetMeaning: item.meaning,
    });
  });

  // 10 Questions Vi -> Eng
  vocabList.slice(20, 30).concat(vocabList.slice(0, 10)).slice(0, 10).forEach((item, index) => {
    const distractors = vocabList
      .filter((v) => v.id !== item.id)
      .sort(() => (index % 2 === 0 ? -0.5 + Math.random() : 0.5 - Math.random()))
      .map((v) => v.word)
      .slice(0, 3);

    const choices = [item.word, ...distractors].sort(() => 0.5 - Math.random());
    const keys = ["a", "b", "c", "d"];
    const options = choices.map((c, i) => ({ key: keys[i], text: c }));
    const correctOpt = options.find((o) => o.text === item.word)!;

    questions.push({
      id: 20 + index + 1,
      prompt: `Từ tiếng Anh nào có nghĩa là "${item.meaning}"?`,
      type: "vi_to_eng",
      options,
      correctKey: correctOpt.key,
      targetWord: item.word,
      targetMeaning: item.meaning,
    });
  });

  return questions;
}

export function VocabFlashcards({
  fullName,
  className,
  onLockChange,
  vocabSet = "test-1",
}: {
  fullName: string;
  className: string;
  onLockChange?: (locked: boolean) => void;
  vocabSet?: "test-1" | "test-2";
}) {
  const isTest2 = vocabSet === "test-2";
  const activeVocabulary = isTest2 ? TEST2_VOCABULARY : TEST1_VOCABULARY;
  const vocabTitle = isTest2 ? "Test 2 (Daily Activities)" : "Test 1";
  const quizSlug = isTest2 ? "test-2-vocab-flashcards" : "test-1-vocab-flashcards";

  const [subMode, setSubMode] = useState<"study" | "practice" | "matching">("study");
  const [isMatchingLocked, setIsMatchingLocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Practice Quiz State
  const [questions, setQuestions] = useState<VocabQuestion[]>(() =>
    isTest2 ? TEST2_IMAGE_QUESTIONS : generateVocabQuestions(activeVocabulary)
  );
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Reset state when switching between vocab sets
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSubMode("study");
    setQuestions(isTest2 ? TEST2_IMAGE_QUESTIONS : generateVocabQuestions(activeVocabulary));
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
  }, [vocabSet]);

  // Notify parent component about lock status when taking the practice test
  useEffect(() => {
    const isLocked = (subMode === "practice" && !isSubmitted) || (subMode === "matching" && isMatchingLocked);
    onLockChange?.(isLocked);
  }, [subMode, isSubmitted, isMatchingLocked, onLockChange]);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = text.replace(/one's/g, "your");
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentItem = activeVocabulary[currentIndex] || activeVocabulary[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeVocabulary.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeVocabulary.length) % activeVocabulary.length);
  };

  const handleOptionSelect = (questionId: number, key: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: key }));
  };

  const submitPractice = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctKey) {
        correctCount++;
      }
    });

    const score = correctCount;
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    setQuizResult({ score, total, percentage });
    setIsSubmitted(true);

    // Record attempt to Supabase backend for Admin reporting
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, className, quizSlug }),
      });
      const data = await response.json();
      if (response.ok && data.attemptId) {
        // Send answers
        const formattedAnswers: Record<string, JsonResponse> = {};
        questions.forEach((q) => {
          // Map to answer key format
          formattedAnswers[`32000000-0000-4000-8000-00000000${String(q.id).padStart(4, "0")}`] = {
            option: userAnswers[q.id] || "none",
          };
        });

        await fetch(`/api/attempts/${data.attemptId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: formattedAnswers }),
        });
      }
    } catch (e) {
      console.warn("Could not save vocab attempt to server:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPractice = () => {
    setQuestions(isTest2 ? TEST2_IMAGE_QUESTIONS : generateVocabQuestions(activeVocabulary));
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
  };

  const isTestingLocked = (subMode === "practice" && !isSubmitted) || (subMode === "matching" && isMatchingLocked);

  return (
    <div className="space-y-6">
      {/* Sub Mode Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fff8e7] p-2 border-2 border-[#f6d77d]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isTestingLocked}
            onClick={() => setSubMode("study")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
              subMode === "study"
                ? "bg-[#f59e0b] text-white shadow-md"
                : isTestingLocked
                ? "opacity-50 cursor-not-allowed text-[#785412]"
                : "text-[#785412] hover:bg-[#ffe9ad]"
            }`}
          >
            <BookOpen size={18} /> 🎴 Thẻ Ghi Nhớ (Flashcards)
          </button>
          <button
            type="button"
            disabled={isTestingLocked && subMode !== "practice"}
            onClick={() => setSubMode("practice")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
              subMode === "practice"
                ? "bg-[#f59e0b] text-white shadow-md"
                : isTestingLocked
                ? "opacity-50 cursor-not-allowed text-[#785412]"
                : "text-[#785412] hover:bg-[#ffe9ad]"
            }`}
          >
            <Award size={18} /> 📝 Bài Luyện Tập {isTest2 ? `Chọn Ảnh (${questions.length} Câu)` : "(30 Câu)"}
          </button>
          {!isTest2 && (
            <button
              type="button"
              disabled={isTestingLocked && subMode !== "matching"}
              onClick={() => {
                setSubMode("matching");
                setIsMatchingLocked(true);
              }}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
                subMode === "matching"
                  ? "bg-[#f59e0b] text-white shadow-md"
                  : isTestingLocked
                  ? "opacity-50 cursor-not-allowed text-[#785412]"
                  : "text-[#785412] hover:bg-[#ffe9ad]"
              }`}
            >
              🔗 Nối câu hỏi &amp; trả lời (24 Câu)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isTestingLocked && (
            <span className="badge bg-[#fee2e2] text-[#991b1b] text-xs font-black animate-pulse">
              <Lock size={13} /> Khóa các phần khác cho tới khi nộp bài
            </span>
          )}
          <span className="badge bg-[#fef0c7] text-[#785412] text-xs font-black">
            🦁 30 Từ Vựng {vocabTitle}
          </span>
        </div>
      </div>

      {/* MODE 1: STUDY FLASHCARDS */}
      {subMode === "study" && (
        <div className="space-y-6">
          {/* Main Flashcard Display */}
          <div className="mx-auto max-w-xl">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[320px] cursor-pointer rounded-3xl border-4 border-[#f6d77d] bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col justify-between text-center select-none"
              style={{
                background: isFlipped ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" : "white",
              }}
            >
              <div className="flex items-center justify-between text-xs font-extrabold text-[#926011]">
                <span className="rounded-full bg-[#fef3c7] px-3 py-1 uppercase tracking-wider">
                  {currentItem.typeVi}
                </span>
                <span className="flex items-center gap-1">
                  <RotateCw size={14} /> Chạm để lật mặt
                </span>
              </div>

              {!isFlipped ? (
                /* Front Side (English) */
                <div className="my-auto py-6 space-y-3">
                  {currentItem.imageUrl && (
                    <div className="mx-auto size-32 overflow-hidden rounded-2xl border-2 border-[#f6d77d] shadow-sm mb-2">
                      <img
                        src={currentItem.imageUrl}
                        alt={currentItem.word}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                  <span className="text-5xl font-black text-[#1e3a8a] tracking-wide block">
                    {currentItem.word}
                  </span>
                  <p className="text-xl font-bold text-[#64748b]">{currentItem.phonetic}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentItem.word);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-4 py-2 text-sm font-extrabold text-white shadow hover:bg-[#2563eb] transition transform active:scale-95"
                  >
                    <Volume2 size={18} /> Nghe phát âm
                  </button>
                </div>
              ) : (
                /* Back Side (Vietnamese Meaning & Example) */
                <div className="my-auto py-6 space-y-4">
                  {currentItem.imageUrl && (
                    <div className="mx-auto size-28 overflow-hidden rounded-2xl border-2 border-[#86efac] shadow-sm mb-1">
                      <img
                        src={currentItem.imageUrl}
                        alt={currentItem.word}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs font-black uppercase text-[#926011] tracking-widest">Nghĩa tiếng Việt</p>
                  <h3 className="text-4xl font-black text-[#15803d]">{currentItem.meaning}</h3>
                  <div className="rounded-2xl bg-white/80 p-4 text-left border border-[#fef0c7]">
                    <p className="text-xs font-extrabold text-[#78350f]">Ví dụ câu:</p>
                    <p className="mt-1 text-base font-bold text-[#1e293b] italic">
                      &quot;{currentItem.example}&quot;
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-bold text-[#94a3b8]">
                <span>Mặt: {isFlipped ? "Tiếng Việt" : "Tiếng Anh"}</span>
                <span>{currentIndex + 1} / {activeVocabulary.length}</span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-secondary flex-1 border-2 border-[#e2e8f0] font-extrabold"
              >
                <ArrowLeft size={18} /> Từ trước
              </button>

              <button
                type="button"
                onClick={() => speak(currentItem.word)}
                className="grid size-12 place-items-center rounded-2xl bg-[#dbeafe] text-[#1d4ed8] hover:bg-[#bfdbfe]"
                title="Nghe phát âm"
              >
                <Volume2 size={22} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary flex-1 !bg-[#f59e0b] hover:!bg-[#d97706] font-extrabold"
              >
                Từ tiếp <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Word List Grid */}
          <div className="card p-6 border-2 border-[#fef0c7]">
            <h3 className="text-lg font-extrabold text-[#78350f] mb-3 flex items-center gap-2">
              <Sparkles size={18} /> Danh sách {activeVocabulary.length} từ vựng {vocabTitle}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {activeVocabulary.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsFlipped(false);
                  }}
                  className={`rounded-xl border-2 p-2.5 text-left text-xs font-bold transition ${
                    idx === currentIndex
                      ? "border-[#f59e0b] bg-[#fef3c7] text-[#78350f] font-black"
                      : "border-[#f1f5f9] bg-white hover:border-[#cbd5e1]"
                  }`}
                >
                  <span className="block text-[10px] text-[#94a3b8]">#{idx + 1}</span>
                  <span className="font-extrabold text-sm block truncate text-[#1e293b]">{item.word}</span>
                  <span className="text-[#64748b] block truncate">{item.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: PRACTICE QUIZ */}
      {subMode === "practice" && (
        <div className="space-y-6">
          {/* Result Banner if Submitted */}
          {isSubmitted && quizResult && (
            <div className="card overflow-hidden border-2 border-[#22c55e] bg-white text-center">
              <div className="bg-[#22c55e] p-6 text-white">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-[#22c55e]">
                  <Award size={32} />
                </span>
                <h3 className="mt-3 text-3xl font-black">Kết quả Bài Luyện Từ Vựng!</h3>
                <p className="mt-1 text-emerald-100 font-bold">
                  Học sinh: {fullName} · Lớp {className}
                </p>
              </div>

              <div className="p-6">
                <p className="text-5xl font-black text-[#15803d]">
                  {quizResult.score} <span className="text-2xl text-slate-400">/ {quizResult.total}</span>
                </p>
                <p className="mt-2 text-xl font-extrabold text-[#166534]">
                  Đạt {quizResult.percentage}% số câu đúng
                </p>

                <p className="mt-4 text-sm font-bold text-slate-600">
                  ✅ Kết quả đã được tự động lưu và gửi cho Giáo viên (Admin) xem chi tiết! Các phần khác đã được mở khóa!
                </p>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetPractice}
                    className="btn btn-primary !bg-[#f59e0b] hover:!bg-[#d97706]"
                  >
                    <RefreshCw size={18} /> Làm lại bài kiểm tra từ vựng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question Cards List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#78350f]">
                  {isTest2
                    ? `Bài Luyện Tập Từ Vựng – Chọn Ảnh (${questions.length} Câu)`
                    : `Bài Luyện Tập Từ Vựng (${questions.length} Câu Hỏi)`}
                </h3>
                <p className="text-xs font-bold text-[#926011] mt-0.5">
                  {isTest2
                    ? "Nhìn các bức tranh và bấm chọn bức tranh thể hiện đúng hành động dưới đây."
                    : "Chọn nghĩa tiếng Việt hoặc từ tiếng Anh tương ứng."}
                </p>
              </div>
              <span className="badge bg-[#fef3c7] text-[#785412] text-xs font-black">
                Đã làm: {Object.keys(userAnswers).length} / {questions.length} câu
              </span>
            </div>

            {questions.map((q, idx) => {
              const selectedKey = userAnswers[q.id];
              const isCorrect = selectedKey === q.correctKey;

              return (
                <div
                  key={q.id}
                  className={`card p-5 border-2 transition ${
                    isSubmitted
                      ? isCorrect
                        ? "border-[#86efac] bg-[#f0fdf4]"
                        : "border-[#fca5a5] bg-[#fef2f2]"
                      : "border-[#fef0c7]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="badge bg-[#fef3c7] text-[#785412] font-black">
                        Câu {idx + 1}
                      </span>
                      <h4 className="text-lg font-black text-[#1e293b]">
                        {q.type === "image_choice" ? (
                          <>
                            Bức tranh nào thể hiện:{" "}
                            <span className="text-[#2563eb] underline decoration-wavy decoration-[#93c5fd]">
                              &quot;{q.targetWord}&quot;
                            </span>
                            ?
                          </>
                        ) : (
                          q.prompt
                        )}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {q.targetMeaning && (
                        <span className="text-xs font-bold text-[#64748b]">
                          (Nghĩa: {q.targetMeaning})
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => speak(q.targetWord)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-extrabold text-[#1d4ed8] hover:bg-[#bfdbfe] transition"
                        title="Nghe phát âm"
                      >
                        <Volume2 size={15} /> Nghe phát âm
                      </button>

                      {isSubmitted && (
                        <span
                          className={`badge font-extrabold ${
                            isCorrect ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fee2e2] text-[#b91c1c]"
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {isCorrect ? "Đúng" : `Đáp án đúng: ${q.correctKey.toUpperCase()}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options Display: Image Choice vs Text Choice */}
                  {q.type === "image_choice" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {q.options.map((opt) => {
                        const isChosen = selectedKey === opt.key;
                        const isCorrectChoice = opt.key === q.correctKey;
                        let cardStyle = "border-[#e2e8f0] bg-white hover:border-[#3b82f6] hover:shadow-md";

                        if (isSubmitted) {
                          if (isCorrectChoice) {
                            cardStyle = "border-[#22c55e] bg-[#f0fdf4] ring-2 ring-[#22c55e]";
                          } else if (isChosen && !isCorrectChoice) {
                            cardStyle = "border-[#ef4444] bg-[#fef2f2] ring-2 ring-[#ef4444]";
                          } else {
                            cardStyle = "border-slate-200 opacity-60";
                          }
                        } else if (isChosen) {
                          cardStyle = "border-[#3b82f6] bg-[#eff6ff] ring-2 ring-[#3b82f6] shadow-md";
                        }

                        return (
                          <button
                            type="button"
                            key={opt.key}
                            disabled={isSubmitted}
                            onClick={() => handleOptionSelect(q.id, opt.key)}
                            className={`group flex flex-col overflow-hidden rounded-2xl border-2 p-3 text-left transition-all ${cardStyle}`}
                          >
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 mb-2.5">
                              {opt.imageUrl ? (
                                <img
                                  src={opt.imageUrl}
                                  alt={opt.caption || opt.key}
                                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="grid size-full place-items-center text-slate-400">Không có ảnh</div>
                              )}

                              <span
                                className={`absolute top-2.5 left-2.5 grid size-7 place-items-center rounded-full text-xs uppercase font-black shadow-md ${
                                  isChosen
                                    ? "bg-[#3b82f6] text-white"
                                    : isSubmitted && isCorrectChoice
                                    ? "bg-[#22c55e] text-white"
                                    : "bg-white/90 text-slate-700 backdrop-blur-sm"
                                }`}
                              >
                                {opt.key}
                              </span>

                              {isSubmitted && isCorrectChoice && (
                                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#22c55e] px-2.5 py-1 text-[11px] font-black text-white shadow">
                                  <CheckCircle2 size={13} /> Đáp án đúng
                                </span>
                              )}
                              {isSubmitted && isChosen && !isCorrectChoice && (
                                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#ef4444] px-2.5 py-1 text-[11px] font-black text-white shadow">
                                  <XCircle size={13} /> Đã chọn
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mt-1">
                              <span className="truncate">{opt.caption}</span>
                              {isChosen && !isSubmitted && (
                                <span className="badge bg-[#3b82f6] text-white text-[10px] font-black">
                                  Đã chọn
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {q.options.map((opt) => {
                        const isChosen = selectedKey === opt.key;
                        const isCorrectChoice = opt.key === q.correctKey;

                        let btnStyle = "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]";

                        if (isSubmitted) {
                          if (isCorrectChoice) {
                            btnStyle = "border-[#22c55e] bg-[#dcfce7] text-[#15803d] font-black";
                          } else if (isChosen && !isCorrectChoice) {
                            btnStyle = "border-[#ef4444] bg-[#fee2e2] text-[#b91c1c] font-black";
                          }
                        } else if (isChosen) {
                          btnStyle = "border-[#f59e0b] bg-[#fef3c7] text-[#78350f] font-black shadow-sm";
                        }

                        return (
                          <button
                            type="button"
                            key={opt.key}
                            disabled={isSubmitted}
                            onClick={() => handleOptionSelect(q.id, opt.key)}
                            className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left font-bold transition ${btnStyle}`}
                          >
                            <span
                              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs uppercase font-extrabold ${
                                isChosen
                                  ? "bg-[#f59e0b] text-white"
                                  : "bg-[#f1f5f9] text-[#64748b]"
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="text-base">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button Bar */}
          {!isSubmitted && (
            <div className="sticky bottom-4 z-20 rounded-2xl bg-white p-4 shadow-2xl border-2 border-[#f59e0b]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">
                  Đã trả lời {Object.keys(userAnswers).length} / {questions.length} câu
                </span>

                <button
                  type="button"
                  onClick={submitPractice}
                  disabled={isSubmitting || Object.keys(userAnswers).length === 0}
                  className="btn btn-primary !bg-[#f59e0b] hover:!bg-[#d97706] px-8 text-base font-black"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                  Nộp Bài Luyện Tập Từ Vựng
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* MODE 3: QUESTION & ANSWER MATCHING */}
      {subMode === "matching" && (
        <VocabMatching
          fullName={fullName}
          className={className}
          onLockChange={setIsMatchingLocked}
        />
      )}
    </div>
  );
}
