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
  type: "eng_to_vi" | "vi_to_eng" | "image_choice" | "contextual";
  options: { key: string; text?: string; imageUrl?: string; caption?: string }[];
  correctKey: string;
  targetWord: string;
  targetMeaning: string;
  sectionTitle?: string;
  sectionDesc?: string;
  explanation?: string;
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

export const TEST3_VOCABULARY: VocabItem[] = [
  { id: 1, word: "peninsulas", phonetic: "/pəˈnɪn.sjʊ.ləz/", type: "noun", meaning: "bán đảo", example: "Florida and Indochina are well-known peninsulas.", typeVi: "danh từ" },
  { id: 2, word: "Earth’s crust", phonetic: "/ɜːθs krʌst/", type: "noun", meaning: "vỏ trái đất", example: "Tectonic plates make up the Earth's crust.", typeVi: "danh từ" },
  { id: 3, word: "tectonic plates", phonetic: "/tekˈtɒn.ɪk pleɪts/", type: "noun", meaning: "các mảng kiến tạo", example: "Earthquakes occur when tectonic plates slide past each other.", typeVi: "danh từ" },
  { id: 4, word: "parallel mountain ranges", phonetic: "/ˈpær.ə.lel ˈmaʊn.tɪn ˈreɪn.dʒɪz/", type: "noun", meaning: "các dãy núi song song", example: "The region features several long parallel mountain ranges.", typeVi: "danh từ" },
  { id: 5, word: "fertile deltas", phonetic: "/ˈfɜː.taɪl ˈdel.təz/", type: "noun", meaning: "đồng bằng phù sa màu mỡ", example: "Farmers grow rice in the fertile deltas of major rivers.", typeVi: "danh từ" },
  { id: 6, word: "volcanic", phonetic: "/vɒlˈkæn.ɪk/", type: "adjective", meaning: "núi lửa (thuộc núi lửa)", example: "The island was formed by ancient volcanic activity.", typeVi: "tính từ" },
  { id: 7, word: "eruptions", phonetic: "/ɪˈrʌp.ʃənz/", type: "noun", meaning: "sự phun trào", example: "Violent volcanic eruptions sent ash into the sky.", typeVi: "danh từ" },
  { id: 8, word: "Ring of Life / Ring of Fire", phonetic: "/rɪŋ əv faɪər/", type: "noun", meaning: "vành đai lửa", example: "Many active volcanoes are situated along the Ring of Fire.", typeVi: "danh từ" },
  { id: 9, word: "rainforests", phonetic: "/ˈreɪn.fɒr.ɪsts/", type: "noun", meaning: "rừng nhiệt đới", example: "Tropical rainforests are home to rare wildlife species.", typeVi: "danh từ" },
  { id: 10, word: "sustained", phonetic: "/səˈsteɪnd/", type: "verb", meaning: "duy trì", example: "The ecosystem is sustained by abundant rainfall.", typeVi: "động từ" },
  { id: 11, word: "monsoon rains", phonetic: "/mɒnˈsuːn reɪnz/", type: "noun", meaning: "cơn mưa gió mùa", example: "Heavy monsoon rains bring needed water to agricultural lands.", typeVi: "danh từ" },
  { id: 12, word: "logging", phonetic: "/ˈlɒɡ.ɪŋ/", type: "noun", meaning: "khai thác gỗ", example: "Illegal logging has reduced the area of natural forests.", typeVi: "danh từ" },
  { id: 13, word: "timber", phonetic: "/ˈtɪm.bər/", type: "noun", meaning: "gỗ xây dựng, gỗ nguyên liệu", example: "The tall trees provide valuable timber for construction.", typeVi: "danh từ" },
  { id: 14, word: "collided", phonetic: "/kəˈlaɪ.dɪd/", type: "verb", meaning: "va chạm", example: "Millions of years ago, two massive landmasses collided.", typeVi: "động từ" },
  { id: 15, word: "landmasses", phonetic: "/ˈlænd.mæs.ɪz/", type: "noun", meaning: "khối đất liền lớn", example: "Continents are the largest landmasses on Earth.", typeVi: "danh từ" },
  { id: 16, word: "upheaval", phonetic: "/ʌpˈhiː.vəl/", type: "noun", meaning: "sự trồi lên / vỏ trái đất bị đẩy lên", example: "Geological upheaval created majestic mountain ridges.", typeVi: "danh từ" },
  { id: 17, word: "cordilleras", phonetic: "/ˌkɔː.dɪlˈjeər.əz/", type: "noun", meaning: "chuỗi hệ thống dãy núi", example: "Extensive cordilleras stretch across the western continent.", typeVi: "danh từ" },
  { id: 18, word: "the Indochina Peninsula", phonetic: "/ðiː ˌɪn.dəʊˈtʃaɪ.nə pəˈnɪn.sjʊ.lə/", type: "noun", meaning: "bán đảo Đông Dương", example: "Vietnam, Laos, and Cambodia are located on the Indochina Peninsula.", typeVi: "danh từ" },
  { id: 19, word: "archipelagos", phonetic: "/ˌɑː.kɪˈpel.ə.ɡəʊz/", type: "noun", meaning: "nhóm quần đảo gần nhau", example: "Indonesia and the Philippines are famous island archipelagos.", typeVi: "danh từ" },
  { id: 20, word: "straddling the Equator", phonetic: "/ˈstræd.lɪŋ ðiː ɪˈkweɪ.tər/", type: "phrase", meaning: "trải qua xích đạo", example: "The archipelago extends across thousands of miles, straddling the Equator.", typeVi: "cụm từ" },
  { id: 21, word: "terrain", phonetic: "/təˈreɪn/", type: "noun", meaning: "địa hình", example: "The rugged mountain terrain makes travel challenging.", typeVi: "danh từ" },
  { id: 22, word: "predominantly", phonetic: "/prɪˈdɒm.ɪ.nənt.li/", type: "adverb", meaning: "phần lớn / chủ yếu", example: "The island's economy is predominantly based on agriculture.", typeVi: "trạng từ" },
  { id: 23, word: "tropical climate", phonetic: "/ˈtrɒp.ɪ.kəl ˈklaɪ.mət/", type: "noun", meaning: "khí hậu nhiệt đới", example: "Countries near the equator usually have a warm tropical climate.", typeVi: "danh từ" },
  { id: 24, word: "extend into = stretches", phonetic: "/ɪkˈstend ˈɪn.tuː/", type: "verb", meaning: "kéo dài vào", example: "The mountain ridges extend into neighbouring countries.", typeVi: "động từ" },
  { id: 25, word: "cover", phonetic: "/ˈkʌv.ər/", type: "verb", meaning: "bao phủ", example: "Dense green forests cover more than half of the province.", typeVi: "động từ" },
  { id: 26, word: "vast of", phonetic: "/vɑːst əv/", type: "phrase", meaning: "rộng", example: "A vast expanse of ocean surrounds the isolated islands.", typeVi: "cụm từ" },
  { id: 27, word: "make up", phonetic: "/meɪk ʌp/", type: "phrasal verb", meaning: "hợp thành", example: "Islands and islets make up the complex archipelago.", typeVi: "cụm động từ" },
  { id: 28, word: "Malay Archipelago", phonetic: "/məˈleɪ ˌɑː.kɪˈpel.ə.ɡəʊ/", type: "noun", meaning: "quần đảo Mã Lai", example: "The Malay Archipelago contains over 25,000 islands.", typeVi: "danh từ" },
  { id: 29, word: "landlocked = without a coast line", phonetic: "/ˈlænd.lɒkt/", type: "adjective", meaning: "0 giáp biển (không giáp biển)", example: "Laos is the only landlocked country in Southeast Asia.", typeVi: "tính từ" },
  { id: 30, word: "lie entirely on", phonetic: "/laɪ ɪnˈtaɪə.li ɒn/", type: "phrase", meaning: "nằm hoàn toàn trên", example: "Some small countries lie entirely on a single island.", typeVi: "cụm từ" },
  { id: 31, word: "trails southward", phonetic: "/treɪlz ˈsaʊθ.wəd/", type: "phrase", meaning: "kéo dài về phía Nam", example: "The long strip of land trails southward toward the sea.", typeVi: "cụm từ" },
  { id: 32, word: "the rest of", phonetic: "/ðə rest əv/", type: "phrase", meaning: "phần còn lại", example: "While northern areas are hilly, the rest of the country is flat.", typeVi: "cụm từ" },
  { id: 33, word: "the insular = island", phonetic: "/ðiː ˈɪn.sjʊ.lər/", type: "noun", meaning: "quần đảo (thuộc quần đảo)", example: "Southeast Asia is divided into mainland and insular regions.", typeVi: "danh từ" },
  { id: 34, word: "span", phonetic: "/spæn/", type: "verb", meaning: "trải", example: "The great forest spans across several national borders.", typeVi: "động từ" },
  { id: 35, word: "permanently", phonetic: "/ˈpɜː.mə.nənt.li/", type: "adverb", meaning: "lâu dài", example: "Some high mountain peaks are permanently covered in snow.", typeVi: "trạng từ" },
  { id: 36, word: "assembly", phonetic: "/əˈsem.bli/", type: "noun", meaning: "quốc hội", example: "Representatives gathered for the national assembly meeting.", typeVi: "danh từ" },
  { id: 37, word: "tips of Malay Peninsula", phonetic: "/tɪps əv məˈleɪ pəˈnɪn.sjʊ.lə/", type: "phrase", meaning: "khối mũi của bán đảo Mã Lai", example: "Singapore lies just off the southern tips of the Malay Peninsula.", typeVi: "cụm từ" },
  { id: 38, word: "inhabited", phonetic: "/ɪnˈhæb.ɪ.tɪd/", type: "adjective", meaning: "không ai ở (theo tài liệu)", example: "Many isolated islets in the ocean remain uninhabited / not inhabited.", typeVi: "tính từ" },
  { id: 39, word: "account for", phonetic: "/əˈkaʊnt fɔːr/", type: "phrasal verb", meaning: "chiếm", example: "Forests account for over forty percent of the total land area.", typeVi: "cụm động từ" },
];

export const TEST3_PART2_QUESTIONS: VocabQuestion[] = [
  {
    id: 40,
    prompt: "What is the commercial activity of cutting down forest trees to harvest timber?",
    type: "contextual",
    targetWord: "logging",
    targetMeaning: "khai thác gỗ",
    correctKey: "b",
    options: [
      { key: "a", text: "Lodging" },
      { key: "b", text: "Logging" },
      { key: "c", text: "Loading" },
      { key: "d", text: "Longing" },
    ],
    explanation: '"Logging" refers specifically to the commercial cutting down of trees for wood. "Lodging" means temporary accommodation, "Loading" is putting cargo into a carrier, and "Longing" is strong desire.',
    sectionTitle: "Phần 2: Câu hỏi phân biệt ngữ cảnh tiếng Anh (4 đáp án na ná nhau)",
    sectionDesc: "Đọc kỹ câu hỏi bằng tiếng Anh và chọn từ / cụm từ tiếng Anh chính xác nhất trong 4 phương án tương tự nhau.",
  },
  {
    id: 41,
    prompt: "What do we call a country that is completely surrounded by land and has no coastline bordering an ocean or sea?",
    type: "contextual",
    targetWord: "landlocked",
    targetMeaning: "không giáp biển",
    correctKey: "c",
    options: [
      { key: "a", text: "Landmass" },
      { key: "b", text: "Landslide" },
      { key: "c", text: "Landlocked" },
      { key: "d", text: "Landmark" },
    ],
    explanation: 'A "landlocked" nation (such as Laos) has no direct coastline to the sea. "Landmass" is a large area of land, "Landslide" is rock/soil falling down a slope, and "Landmark" is a prominent recognizable feature.',
  },
  {
    id: 42,
    prompt: "What is the geographical term for a vast, continuous system of parallel mountain ranges?",
    type: "contextual",
    targetWord: "cordilleras",
    targetMeaning: "chuỗi hệ thống dãy núi",
    correctKey: "a",
    options: [
      { key: "a", text: "Cordilleras" },
      { key: "b", text: "Corridors" },
      { key: "c", text: "Calderas" },
      { key: "d", text: "Cylinders" },
    ],
    explanation: '"Cordilleras" is an extensive interconnected network of parallel mountain ranges. "Calderas" are volcanic craters, "Corridors" are long passageways, and "Cylinders" are geometric shapes.',
  },
  {
    id: 43,
    prompt: "When two massive tectonic plates crash forcefully into each other over millions of years, scientists say they have:",
    type: "contextual",
    targetWord: "collided",
    targetMeaning: "va chạm",
    correctKey: "d",
    options: [
      { key: "a", text: "Collapsed" },
      { key: "b", text: "Collected" },
      { key: "c", text: "Colluded" },
      { key: "d", text: "Collided" },
    ],
    explanation: '"Collided" means crashed forcefully together. "Collapsed" means fell in or broke down, "Collected" means gathered, and "Colluded" means conspired secretly.',
  },
  {
    id: 44,
    prompt: "What is the outermost solid, rocky shell that forms the surface of our planet Earth?",
    type: "contextual",
    targetWord: "the Earth's crust",
    targetMeaning: "vỏ trái đất",
    correctKey: "b",
    options: [
      { key: "a", text: "The Earth's rust" },
      { key: "b", text: "The Earth's crust" },
      { key: "c", text: "The Earth's dust" },
      { key: "d", text: "The Earth's trust" },
    ],
    explanation: '"The Earth\'s crust" is the solid rocky outer layer covering the Earth. "Rust" is iron oxide, "Dust" is powdered dirt, and "Trust" is faith/confidence.',
  },
  {
    id: 45,
    prompt: "What do geologists call the sudden, violent expelling of molten lava, ash, and gases from a volcano?",
    type: "contextual",
    targetWord: "volcanic eruptions",
    targetMeaning: "sự phun trào núi lửa",
    correctKey: "a",
    options: [
      { key: "a", text: "Volcanic eruptions" },
      { key: "b", text: "Volcanic disruptions" },
      { key: "c", text: "Volcanic interruptions" },
      { key: "d", text: "Volcanic corruptions" },
    ],
    explanation: '"Volcanic eruptions" is the precise geological term for the explosion and release of magma and ash. "Disruptions" means disturbances, and "Interruptions" means temporary stops.',
  },
  {
    id: 46,
    prompt: "What is the major horseshoe-shaped seismic belt around the Pacific Ocean where most of the world's earthquakes and volcanoes occur?",
    type: "contextual",
    targetWord: "Ring of Fire",
    targetMeaning: "vành đai lửa",
    correctKey: "c",
    options: [
      { key: "a", text: "Ring of Flame" },
      { key: "b", text: "Ring of Flare" },
      { key: "c", text: "Ring of Fire" },
      { key: "d", text: "Ring of Frost" },
    ],
    explanation: '"Ring of Fire" is the internationally recognized geographical name for the Pacific volcanic belt.',
  },
  {
    id: 47,
    prompt: "What is a piece of land projecting into a body of water, bordered by water on three sides while connected to the mainland on one side?",
    type: "contextual",
    targetWord: "peninsulas",
    targetMeaning: "bán đảo",
    correctKey: "a",
    options: [
      { key: "a", text: "Peninsulas" },
      { key: "b", text: "Perimeters" },
      { key: "c", text: "Peripherals" },
      { key: "d", text: "Plateaus" },
    ],
    explanation: '"Peninsulas" (like Florida or Indochina) are pieces of land surrounded by water on three sides. "Plateaus" are elevated flatlands, and "Perimeters" are outer boundaries.',
  },
  {
    id: 48,
    prompt: "Which phrasal verb means to make up, form, or constitute a specific proportion or percentage of a whole?",
    type: "contextual",
    targetWord: "account for",
    targetMeaning: "chiếm",
    correctKey: "b",
    options: [
      { key: "a", text: "Amount to" },
      { key: "b", text: "Account for" },
      { key: "c", text: "Apply for" },
      { key: "d", text: "Ask for" },
    ],
    explanation: '"Account for" + percentage means to constitute or comprise that proportion (e.g., "Mountains account for 40% of the land").',
  },
  {
    id: 49,
    prompt: "What is the geological term for the powerful, sudden upward displacement and deformation of the Earth's crust?",
    type: "contextual",
    targetWord: "geological upheaval",
    targetMeaning: "sự trồi lên của vỏ trái đất",
    correctKey: "d",
    options: [
      { key: "a", text: "Geological upgrade" },
      { key: "b", text: "Geological uprising" },
      { key: "c", text: "Geological update" },
      { key: "d", text: "Geological upheaval" },
    ],
    explanation: '"Upheaval" is the geological term for tectonic forces pushing rock layers upward. "Uprising" means a political rebellion, and "Upgrade" means an improvement.',
  },
  {
    id: 50,
    prompt: "Which adverb means 'mostly', 'primarily', or 'forming the largest and most dominant part'?",
    type: "contextual",
    targetWord: "predominantly",
    targetMeaning: "phần lớn / chủ yếu",
    correctKey: "a",
    options: [
      { key: "a", text: "Predominantly" },
      { key: "b", text: "Permanently" },
      { key: "c", text: "Prominently" },
      { key: "d", text: "Proportionally" },
    ],
    explanation: '"Predominantly" means primarily or for the most part. "Permanently" means forever, and "Prominently" means in a way that stands out visually.',
  },
  {
    id: 51,
    prompt: "What are the seasonal heavy rains brought by tropical wind systems that bring vital water to Southeast Asian agriculture?",
    type: "contextual",
    targetWord: "monsoon rains",
    targetMeaning: "những cơn mưa gió mùa",
    correctKey: "c",
    options: [
      { key: "a", text: "Moon rains" },
      { key: "b", text: "Morning rains" },
      { key: "c", text: "Monsoon rains" },
      { key: "d", text: "Mountain rains" },
    ],
    explanation: '"Monsoon rains" are seasonal precipitation cycles driven by tropical monsoon wind patterns.',
  },
  {
    id: 52,
    prompt: "If a country or territory spans across both the Northern and Southern hemispheres across the 0° latitude line, it is:",
    type: "contextual",
    targetWord: "straddling the Equator",
    targetMeaning: "nằm vắt ngang qua xích đạo",
    correctKey: "b",
    options: [
      { key: "a", text: "Stretching the Equator" },
      { key: "b", text: "Straddling the Equator" },
      { key: "c", text: "Struggling the Equator" },
      { key: "d", text: "Striking the Equator" },
    ],
    explanation: '"Straddling the Equator" means extending across or having territory on both sides of the Equator.',
  },
  {
    id: 53,
    prompt: "What do we call vast chains or clusters of many islands scattered across the sea (such as Indonesia or the Philippines)?",
    type: "contextual",
    targetWord: "archipelagos",
    targetMeaning: "các quần đảo rộng lớn",
    correctKey: "a",
    options: [
      { key: "a", text: "Archipelagos" },
      { key: "b", text: "Architraves" },
      { key: "c", text: "Architects" },
      { key: "d", text: "Archetypes" },
    ],
    explanation: '"Archipelagos" refers to large groups or clusters of islands. "Architects" design buildings, "Archetypes" are typical examples, and "Architraves" are door/window moldings.',
  },
  {
    id: 54,
    prompt: "Which geographical adjective is used to designate the island territories of Southeast Asia, as opposed to the continental mainland?",
    type: "contextual",
    targetWord: "the insular region",
    targetMeaning: "vùng hải đảo / quần đảo",
    correctKey: "c",
    options: [
      { key: "a", text: "The insulator region" },
      { key: "b", text: "The insulin region" },
      { key: "c", text: "The insular region" },
      { key: "d", text: "The isolated region" },
    ],
    explanation: '"Insular" (from Latin "insula" meaning island) is the geographical term for island regions as opposed to the continental mainland.',
  },
];

export const TEST4_VOCABULARY: VocabItem[] = [
  {
    id: 1,
    word: "tablet",
    phonetic: "/ˈtæb.lət/",
    type: "noun",
    meaning: "máy tính bảng",
    example: "She is playing an educational game on her tablet.",
    typeVi: "danh từ",
  },
  {
    id: 2,
    word: "wardrobe",
    phonetic: "/ˈwɔː.drəʊb/",
    type: "noun",
    meaning: "tủ quần áo",
    example: "He hung his new clothes neatly inside the wardrobe.",
    typeVi: "danh từ",
  },
  {
    id: 3,
    word: "rug",
    phonetic: "/rʌɡ/",
    type: "noun",
    meaning: "thảm trải sàn",
    example: "There is a soft and colorful rug on the bedroom floor.",
    typeVi: "danh từ",
  },
  {
    id: 4,
    word: "board games",
    phonetic: "/ˈbɔːd ˌɡeɪmz/",
    type: "noun",
    meaning: "những trò chơi có tính tương tác cao",
    example: "My family loves playing board games together on weekend evenings.",
    typeVi: "danh từ",
  },
  {
    id: 5,
    word: "wheelchair",
    phonetic: "/ˈwiːl.tʃeər/",
    type: "noun",
    meaning: "xe lăn",
    example: "The boy uses a wheelchair to move around the school comfortably.",
    typeVi: "danh từ",
  },
  {
    id: 6,
    word: "hold",
    phonetic: "/həʊld/",
    type: "verb",
    meaning: "giữ",
    example: "Please hold my hand when we cross the busy street.",
    typeVi: "động từ",
  },
  {
    id: 7,
    word: "reach for",
    phonetic: "/riːtʃ fɔːr/",
    type: "verb",
    meaning: "vươn tay để lấy",
    example: "The little girl reached for the storybook on the high shelf.",
    typeVi: "cụm động từ",
  },
];

export function generateTest4Questions(): VocabQuestion[] {
  return [
    // PHẦN 1: Nhận diện nghĩa từ vựng tiếng Anh trực tiếp
    {
      id: 1,
      prompt: 'Nghĩa tiếng Việt của từ "tablet" là gì?',
      type: "eng_to_vi",
      targetWord: "tablet",
      targetMeaning: "máy tính bảng",
      correctKey: "a",
      options: [
        { key: "a", text: "máy tính bảng" },
        { key: "b", text: "tủ quần áo" },
        { key: "c", text: "thảm trải sàn" },
        { key: "d", text: "xe lăn" },
      ],
      explanation: '"tablet" có nghĩa là máy tính bảng, thiết bị điện tử màn hình cảm ứng dùng để học tập và giải trí.',
      sectionTitle: "Phần 1: Nhận biết nghĩa từ vựng (English ➔ Tiếng Việt)",
      sectionDesc: "Đọc từ tiếng Anh và chọn nghĩa tiếng Việt chính xác nhất.",
    },
    {
      id: 2,
      prompt: 'Nghĩa tiếng Việt của từ "wardrobe" là gì?',
      type: "eng_to_vi",
      targetWord: "wardrobe",
      targetMeaning: "tủ quần áo",
      correctKey: "b",
      options: [
        { key: "a", text: "thảm trải sàn" },
        { key: "b", text: "tủ quần áo" },
        { key: "c", text: "máy tính bảng" },
        { key: "d", text: "những trò chơi có tính tương tác cao" },
      ],
      explanation: '"wardrobe" có nghĩa là tủ quần áo, đồ dùng nội thất trong gia đình dùng để treo và cất giữ trang phục.',
    },
    {
      id: 3,
      prompt: 'Nghĩa tiếng Việt của từ "rug" là gì?',
      type: "eng_to_vi",
      targetWord: "rug",
      targetMeaning: "thảm trải sàn",
      correctKey: "c",
      options: [
        { key: "a", text: "xe lăn" },
        { key: "b", text: "giữ" },
        { key: "c", text: "thảm trải sàn" },
        { key: "d", text: "tủ quần áo" },
      ],
      explanation: '"rug" có nghĩa là thảm trải sàn, tấm thảm trang trí hoặc giữ ấm trên sàn nhà.',
    },
    {
      id: 4,
      prompt: 'Nghĩa tiếng Việt của cụm từ "board games" là gì?',
      type: "eng_to_vi",
      targetWord: "board games",
      targetMeaning: "những trò chơi có tính tương tác cao",
      correctKey: "d",
      options: [
        { key: "a", text: "máy tính bảng" },
        { key: "b", text: "vươn tay để lấy" },
        { key: "c", text: "xe lăn" },
        { key: "d", text: "những trò chơi có tính tương tác cao" },
      ],
      explanation: '"board games" là những trò chơi có tính tương tác cao (như cờ cá ngựa, cờ tỉ phú, cờ vua...) nhiều người cùng chơi.',
    },
    {
      id: 5,
      prompt: 'Nghĩa tiếng Việt của từ "wheelchair" là gì?',
      type: "eng_to_vi",
      targetWord: "wheelchair",
      targetMeaning: "xe lăn",
      correctKey: "a",
      options: [
        { key: "a", text: "xe lăn" },
        { key: "b", text: "thảm trải sàn" },
        { key: "c", text: "tủ quần áo" },
        { key: "d", text: "máy tính bảng" },
      ],
      explanation: '"wheelchair" có nghĩa là xe lăn, phương tiện hỗ trợ di chuyển cho người khuyết tật hoặc gặp khó khăn khi đi lại.',
    },
    {
      id: 6,
      prompt: 'Nghĩa tiếng Việt của từ "hold" là gì?',
      type: "eng_to_vi",
      targetWord: "hold",
      targetMeaning: "giữ",
      correctKey: "b",
      options: [
        { key: "a", text: "vươn tay để lấy" },
        { key: "b", text: "giữ" },
        { key: "c", text: "xe lăn" },
        { key: "d", text: "những trò chơi có tính tương tác cao" },
      ],
      explanation: '"hold" là động từ có nghĩa là giữ, cầm hoặc nắm chắc vật gì đó bằng tay.',
    },
    {
      id: 7,
      prompt: 'Nghĩa tiếng Việt của cụm từ "reach for" là gì?',
      type: "eng_to_vi",
      targetWord: "reach for",
      targetMeaning: "vươn tay để lấy",
      correctKey: "c",
      options: [
        { key: "a", text: "giữ" },
        { key: "b", text: "thảm trải sàn" },
        { key: "c", text: "vươn tay để lấy" },
        { key: "d", text: "tủ quần áo" },
      ],
      explanation: '"reach for" là cụm động từ có nghĩa là vươn tay, với tay để lấy hoặc chạm vào một vật thể.',
    },

    // PHẦN 2: Đoán nghĩa từ vựng qua câu ngữ cảnh tiếng Anh
    {
      id: 8,
      prompt: 'Trong câu: "She is learning English on her tablet.", từ "tablet" có nghĩa là gì?',
      type: "contextual",
      targetWord: "tablet",
      targetMeaning: "máy tính bảng",
      correctKey: "a",
      options: [
        { key: "a", text: "máy tính bảng" },
        { key: "b", text: "xe lăn" },
        { key: "c", text: "tủ quần áo" },
        { key: "d", text: "thảm trải sàn" },
      ],
      explanation: 'Trong câu "She is learning English on her tablet.", từ "tablet" mang nghĩa là máy tính bảng dùng để học tiếng Anh.',
      sectionTitle: "Phần 2: Đoán nghĩa từ vựng trong câu ngữ cảnh tiếng Anh",
      sectionDesc: "Đọc câu tiếng Anh và chọn nghĩa tiếng Việt chính xác nhất của từ / cụm từ được dùng trong câu.",
    },
    {
      id: 9,
      prompt: 'Trong câu: "He puts his shirts and trousers in the wardrobe.", từ "wardrobe" có nghĩa là gì?',
      type: "contextual",
      targetWord: "wardrobe",
      targetMeaning: "tủ quần áo",
      correctKey: "b",
      options: [
        { key: "a", text: "thảm trải sàn" },
        { key: "b", text: "tủ quần áo" },
        { key: "c", text: "máy tính bảng" },
        { key: "d", text: "những trò chơi có tính tương tác cao" },
      ],
      explanation: 'Trong câu trên, "wardrobe" có nghĩa là tủ quần áo, nơi cất giữ áo sơ mi và quần dài.',
    },
    {
      id: 10,
      prompt: 'Trong câu: "There is a soft round rug in the living room.", từ "rug" có nghĩa là gì?',
      type: "contextual",
      targetWord: "rug",
      targetMeaning: "thảm trải sàn",
      correctKey: "c",
      options: [
        { key: "a", text: "xe lăn" },
        { key: "b", text: "tủ quần áo" },
        { key: "c", text: "thảm trải sàn" },
        { key: "d", text: "máy tính bảng" },
      ],
      explanation: 'Trong câu trên, "rug" có nghĩa là chiếc thảm trải sàn êm ái hình tròn ở phòng khách.',
    },
    {
      id: 11,
      prompt: 'Trong câu: "We often play board games with friends on weekends.", cụm từ "board games" có nghĩa là gì?',
      type: "contextual",
      targetWord: "board games",
      targetMeaning: "những trò chơi có tính tương tác cao",
      correctKey: "d",
      options: [
        { key: "a", text: "máy tính bảng" },
        { key: "b", text: "vươn tay để lấy" },
        { key: "c", text: "xe lăn" },
        { key: "d", text: "những trò chơi có tính tương tác cao" },
      ],
      explanation: 'Trong câu trên, "board games" là những trò chơi có tính tương tác cao mà bạn bè cùng tham gia vào cuối tuần.',
    },
    {
      id: 12,
      prompt: 'Trong câu: "The nurse helped the boy sit in the wheelchair.", từ "wheelchair" có nghĩa là gì?',
      type: "contextual",
      targetWord: "wheelchair",
      targetMeaning: "xe lăn",
      correctKey: "a",
      options: [
        { key: "a", text: "xe lăn" },
        { key: "b", text: "thảm trải sàn" },
        { key: "c", text: "tủ quần áo" },
        { key: "d", text: "máy tính bảng" },
      ],
      explanation: 'Trong câu trên, "wheelchair" là xe lăn giúp người bệnh hoặc bạn nhỏ di chuyển thuận tiện.',
    },
    {
      id: 13,
      prompt: 'Trong câu: "Please hold this book for me, please.", từ "hold" có nghĩa là gì?',
      type: "contextual",
      targetWord: "hold",
      targetMeaning: "giữ",
      correctKey: "b",
      options: [
        { key: "a", text: "vươn tay để lấy" },
        { key: "b", text: "giữ" },
        { key: "c", text: "xe lăn" },
        { key: "d", text: "thảm trải sàn" },
      ],
      explanation: 'Trong câu trên, "hold" có nghĩa là giữ hoặc cầm giúp quyển sách.',
    },
    {
      id: 14,
      prompt: 'Trong câu: "The girl reached for the storybook on the top shelf.", cụm từ "reached for" có nghĩa là gì?',
      type: "contextual",
      targetWord: "reach for",
      targetMeaning: "vươn tay để lấy",
      correctKey: "c",
      options: [
        { key: "a", text: "giữ" },
        { key: "b", text: "thảm trải sàn" },
        { key: "c", text: "vươn tay để lấy" },
        { key: "d", text: "tủ quần áo" },
      ],
      explanation: 'Trong câu trên, "reached for" có nghĩa là vươn tay để lấy quyển truyện ở trên giá cao.',
    },
  ];
}

export function generateTest3Questions(): VocabQuestion[] {
  const questions: VocabQuestion[] = [];
  const keys = ["a", "b", "c", "d"];

  // PHẦN 1: Full 39 câu dịch từ tiếng Anh sang tiếng Việt
  TEST3_VOCABULARY.forEach((item, index) => {
    // Pick 3 distractors from the remaining 38 words
    const otherMeanings = TEST3_VOCABULARY
      .filter((v) => v.id !== item.id)
      .map((v) => v.meaning);

    // Deterministic offset pick so options are stable but well varied
    const d1 = otherMeanings[(index * 7 + 1) % otherMeanings.length];
    const d2 = otherMeanings[(index * 13 + 5) % otherMeanings.length];
    const d3 = otherMeanings[(index * 19 + 11) % otherMeanings.length];

    // Ensure 3 unique distractors different from item.meaning
    const pool = otherMeanings.filter((m) => m !== item.meaning && m !== d1 && m !== d2 && m !== d3);
    const distractorList = [d1, d2, d3];
    if (distractorList.includes(item.meaning) || new Set(distractorList).size < 3) {
      distractorList[0] = pool[0] || "đồng bằng";
      distractorList[1] = pool[1] || "rừng nhiệt đới";
      distractorList[2] = pool[2] || "khí hậu nhiệt đới";
    }

    // Place the correct meaning at variable position (index % 4)
    const correctPos = (index + 1) % 4;
    const choices: string[] = [];
    let distractorIdx = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === correctPos) {
        choices.push(item.meaning);
      } else {
        choices.push(distractorList[distractorIdx++]);
      }
    }

    const options = choices.map((choice, i) => ({ key: keys[i], text: choice }));
    const correctOpt = options[correctPos];

    questions.push({
      id: index + 1,
      prompt: `Nghĩa tiếng Việt của từ / cụm từ "${item.word}" là gì?`,
      type: "eng_to_vi",
      options,
      correctKey: correctOpt.key,
      targetWord: item.word,
      targetMeaning: item.meaning,
      sectionTitle: index === 0 ? "Phần 1: Dịch nghĩa 39 từ vựng tiếng Anh sang tiếng Việt" : undefined,
      sectionDesc: index === 0 ? "Chọn nghĩa tiếng Việt chính xác nhất tương ứng với từ vựng tiếng Anh." : undefined,
    });
  });

  // PHẦN 2: 15 câu hỏi phân biệt ngữ cảnh với các đáp án tương tự nhau
  TEST3_PART2_QUESTIONS.forEach((q) => {
    // Shuffle options predictably while keeping track of correctKey
    questions.push(q);
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
  vocabSet?: "test-1" | "test-2" | "test-3" | "test-4";
}) {
  const isTest2 = vocabSet === "test-2";
  const isTest3 = vocabSet === "test-3";
  const isTest4 = vocabSet === "test-4";
  const activeVocabulary = isTest4
    ? TEST4_VOCABULARY
    : isTest3
    ? TEST3_VOCABULARY
    : isTest2
    ? TEST2_VOCABULARY
    : TEST1_VOCABULARY;
  const vocabTitle = isTest4
    ? "Test 4 (Home Items & Actions)"
    : isTest3
    ? "Test 3 (Geography & Earth Science)"
    : isTest2
    ? "Test 2 (Daily Activities)"
    : "Test 1";
  const quizSlug = isTest4
    ? "test-4-vocab-flashcards"
    : isTest3
    ? "test-3-vocab-flashcards"
    : isTest2
    ? "test-2-vocab-flashcards"
    : "test-1-vocab-flashcards";

  const [subMode, setSubMode] = useState<"study" | "practice" | "matching">("study");
  const [isMatchingLocked, setIsMatchingLocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const getInitialQuestions = () => {
    if (isTest4) return generateTest4Questions();
    if (isTest3) return generateTest3Questions();
    if (isTest2) return TEST2_IMAGE_QUESTIONS;
    return generateVocabQuestions(activeVocabulary);
  };

  // Practice Quiz State
  const [questions, setQuestions] = useState<VocabQuestion[]>(getInitialQuestions);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Reset state when switching between vocab sets
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSubMode("study");
    setQuestions(getInitialQuestions());
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
    setQuestions(getInitialQuestions());
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
            <Award size={18} /> 📝 Bài Luyện Tập{" "}
            {isTest4
              ? `(14 Câu: Đoán nghĩa Tiếng Việt)`
              : isTest3
              ? `(54 Câu: Dịch & Ngữ cảnh)`
              : isTest2
              ? `Chọn Ảnh (${questions.length} Câu)`
              : "(30 Câu)"}
          </button>
          {!isTest2 && !isTest3 && !isTest4 && (
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
            🦁 {activeVocabulary.length} Từ Vựng {vocabTitle}
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
                  {isTest3
                    ? `Bài Luyện Tập Từ Vựng Địa Lý & Trái Đất (${questions.length} Câu Hỏi: 2 Phần)`
                    : isTest2
                    ? `Bài Luyện Tập Từ Vựng – Chọn Ảnh (${questions.length} Câu)`
                    : `Bài Luyện Tập Từ Vựng (${questions.length} Câu Hỏi)`}
                </h3>
                <p className="text-xs font-bold text-[#926011] mt-0.5">
                  {isTest3
                    ? "Phần 1: Dịch 39 từ tiếng Anh sang tiếng Việt. Phần 2: 15 câu chọn đáp án phân biệt ngữ cảnh chính xác."
                    : isTest2
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
                <div key={q.id} className="space-y-3">
                  {q.sectionTitle && (
                    <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-4 text-white shadow-lg border-2 border-amber-300">
                      <div className="flex items-center gap-2 text-lg font-black tracking-wide">
                        <Sparkles size={20} className="text-yellow-200 animate-pulse" />
                        {q.sectionTitle}
                      </div>
                      {q.sectionDesc && (
                        <p className="mt-1 text-xs font-bold text-amber-100">{q.sectionDesc}</p>
                      )}
                    </div>
                  )}

                  <div
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
                      <button
                        type="button"
                        onClick={() =>
                          speak(
                            q.type === "contextual" && !isSubmitted
                              ? q.prompt
                              : q.targetWord
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-extrabold text-[#1d4ed8] hover:bg-[#bfdbfe] transition"
                        title={q.type === "contextual" && !isSubmitted ? "Nghe câu hỏi" : "Nghe phát âm"}
                      >
                        <Volume2 size={15} />{" "}
                        {q.type === "contextual" && !isSubmitted
                          ? "Nghe câu hỏi"
                          : "Nghe phát âm"}
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

                  {isSubmitted && q.explanation && (
                    <div className="mt-4 rounded-xl bg-amber-50/90 border-2 border-amber-200 p-3.5 text-xs font-bold text-amber-950 shadow-sm">
                      <div className="flex items-center gap-1.5 font-extrabold text-amber-800 mb-1">
                        <Sparkles size={14} /> Giải thích chi tiết:
                      </div>
                      <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
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
