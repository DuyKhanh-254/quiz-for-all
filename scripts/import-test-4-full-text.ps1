$supabaseUrl = "https://syghsisooccdvpvshgvm.supabase.co"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw"
$h = @{ "apikey"=$serviceKey; "Authorization"="Bearer $serviceKey"; "Content-Type"="application/json; charset=utf-8"; "Prefer"="resolution=merge-duplicates" }
$dh = @{ "apikey"=$serviceKey; "Authorization"="Bearer $serviceKey" }
$assetBase = "$supabaseUrl/storage/v1/object/public/quiz-assets/english-grade-2-test-4"
$quizId = "14000000-0000-4000-8000-000000000001"

# 1. Update Quiz
$quizRow = @{
  id = $quizId
  slug = "cambridge-starters-test-4-mixed"
  title = "Test 4 - Cambridge Starters Practice"
  description = "Listening Parts 2, 3 and 4 (Full Tu Luan)"
  grade = "Pre A1"
  subject = "English"
  is_published = $true
}
Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quizzes?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($quizRow | ConvertTo-Json -Depth 5)))
Write-Host "Quiz Test 4 updated."

# 2. Update Sections
$s1Id = "24000000-0000-4000-8000-000000000001"
$s2Id = "24000000-0000-4000-8000-000000000002"
$s3Id = "24000000-0000-4000-8000-000000000003"

$sections = @(
  @{ id=$s1Id; quiz_id=$quizId; title="Listening - Part 2"; instruction="Read the question. Listen and write a name or a number."; section_type="fill_blank"; position=1; audio_url="$assetBase/audio/test4-lis-part2.mp3"; image_url="$assetBase/images/listening/test4-part2-scene.jpg" },
  @{ id=$s2Id; quiz_id=$quizId; title="Listening - Part 3"; instruction="Listen to the audio and write short answers for each question."; section_type="fill_blank"; position=2; audio_url="$assetBase/audio/test4-lis-part3.mp3"; image_url=$null },
  @{ id=$s3Id; quiz_id=$quizId; title="Listening - Part 4"; instruction="Listen and write the color for each cake."; section_type="fill_blank"; position=3; audio_url="$assetBase/audio/test4-lis-part4.mp3"; image_url="$assetBase/images/listening/test4-part4-scene.jpg" }
)
foreach ($sec in $sections) {
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quiz_sections?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($sec | ConvertTo-Json -Depth 5)))
  Write-Host "Section $($sec.title) updated."
}

# Delete existing questions for Test 4 to re-insert clean 31 fill_blank questions
try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?quiz_id=eq.$quizId" -Method Delete -Headers $dh } catch {}

$publicContent = Get-Content "d:\WEB_QUIZ\content\test-4.public.json" -Raw | ConvertFrom-Json
$privateAnswers = Get-Content "d:\WEB_QUIZ\content\test-4.private.json" -Raw | ConvertFrom-Json

foreach ($section in $publicContent.sections) {
  foreach ($question in $section.questions) {
    $qRow = @{
      id = $question.id
      quiz_id = $quizId
      section_id = $section.id
      position = $question.position
      question_type = "fill_blank"
      prompt = $question.prompt
      points = 1
      metadata = if ($question.metadata) { $question.metadata } else { @{} }
    }
    Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($qRow | ConvertTo-Json -Depth 5)))
    
    # Clean question_options
    try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options?question_id=eq.$($question.id)" -Method Delete -Headers $dh } catch {}
    
    # Answer key
    $qId = $question.id
    $ans = $privateAnswers.$qId
    if ($ans) {
      $keyRow = @{ question_id = $question.id; answer = $ans }
      Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/answer_keys?on_conflict=question_id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($keyRow | ConvertTo-Json -Depth 5)))
    }
  }
}

Write-Host "Successfully imported 31 full fill_blank questions for Test 4!"
