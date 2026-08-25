$supabaseUrl = "https://syghsisooccdvpvshgvm.supabase.co"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw"
$h = @{ "apikey"=$serviceKey; "Authorization"="Bearer $serviceKey"; "Content-Type"="application/json; charset=utf-8"; "Prefer"="resolution=merge-duplicates" }
$assetBase = "$supabaseUrl/storage/v1/object/public/quiz-assets/english-grade-2-test-4"
$quizId = "14000000-0000-4000-8000-000000000001"

# 1. Insert Quiz
$quizRow = @{
  id = $quizId
  slug = "cambridge-starters-test-4-mixed"
  title = "Test 4 - Cambridge Starters Practice"
  description = "Listening Parts 2, 3 and 4 (Test 1)"
  grade = "Pre A1"
  subject = "English"
  is_published = $true
}
Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quizzes?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($quizRow | ConvertTo-Json -Depth 5)))
Write-Host "Quiz Test 4 inserted."

# 2. Insert Sections
$s1Id = "24000000-0000-4000-8000-000000000001"
$s2Id = "24000000-0000-4000-8000-000000000002"
$s3Id = "24000000-0000-4000-8000-000000000003"

$sections = @(
  @{ id=$s1Id; quiz_id=$quizId; title="Listening - Part 2"; instruction="Read the question. Listen and write a name or a number."; section_type="fill_blank"; position=1; audio_url="$assetBase/audio/test4-lis-part2.mp3"; image_url="$assetBase/images/listening/test4-part2-scene.jpg" },
  @{ id=$s2Id; quiz_id=$quizId; title="Listening - Part 3"; instruction="Listen and tick the box. There is one example."; section_type="listening_image_choice"; position=2; audio_url="$assetBase/audio/test4-lis-part3.mp3"; image_url=$null },
  @{ id=$s3Id; quiz_id=$quizId; title="Listening - Part 4"; instruction="Listen and choose the correct colour for each cake."; section_type="listening_choice"; position=3; audio_url="$assetBase/audio/test4-lis-part4.mp3"; image_url="$assetBase/images/listening/test4-part4-scene.jpg" }
)
foreach ($sec in $sections) {
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quiz_sections?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($sec | ConvertTo-Json -Depth 5)))
  Write-Host "Section $($sec.title) inserted."
}

# 3. Insert Questions, Options & Answer Keys
# Section 1 (fill_blank)
$qS1 = @(
  @{ id="34000000-0000-4000-8000-000000000001"; pos=1; prompt="What is Tom's friend's name?"; meta=@{}; ans=@{ accepted=@("Ben") } },
  @{ id="34000000-0000-4000-8000-000000000002"; pos=2; prompt="How old is Tom's friend?"; meta=@{}; ans=@{ accepted=@("12", "twelve") } },
  @{ id="34000000-0000-4000-8000-000000000003"; pos=3; prompt="How many brothers has Tom's friend got?"; meta=@{}; ans=@{ accepted=@("5", "five") } },
  @{ id="34000000-0000-4000-8000-000000000004"; pos=4; prompt="How many children are in Tom's class?"; meta=@{}; ans=@{ accepted=@("18", "eighteen") } },
  @{ id="34000000-0000-4000-8000-000000000005"; pos=5; prompt="What is the name of Tom's teacher?"; meta=@{ hint="Mr _______" }; ans=@{ accepted=@("Hall", "Mr Hall", "Mr. Hall", "Mr.Hall") } }
)

foreach ($q in $qS1) {
  $qRow = @{ id=$q.id; quiz_id=$quizId; section_id=$s1Id; position=$q.pos; question_type="fill_blank"; prompt=$q.prompt; points=1; metadata=$q.meta }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($qRow | ConvertTo-Json -Depth 5)))
  $keyRow = @{ question_id=$q.id; answer=$q.ans }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/answer_keys?on_conflict=question_id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($keyRow | ConvertTo-Json -Depth 5)))
}
Write-Host "Section 1 questions inserted."

# Section 2 (image_choice)
$qS2 = @(
  @{ id="34000000-0000-4000-8000-000000000006"; pos=1; prompt="What is Anna taking to school?"; ans=@{ option="b" }; opts=@(@("a", "Jacket and pens", "q1-a.jpg"), @("b", "Books and pens", "q1-b.jpg"), @("c", "Jacket, books and pens", "q1-c.jpg")) },
  @{ id="34000000-0000-4000-8000-000000000007"; pos=2; prompt="Which is Bill's dad?"; ans=@{ option="c" }; opts=@(@("a", "Washing car", "q2-a.jpg"), @("b", "Playing basketball", "q2-b.jpg"), @("c", "Painting window", "q2-c.jpg")) },
  @{ id="34000000-0000-4000-8000-000000000008"; pos=3; prompt="What would Sam like to do?"; ans=@{ option="b" }; opts=@(@("a", "Play tennis", "q3-a.jpg"), @("b", "Play computer game", "q3-b.jpg"), @("c", "Watch TV", "q3-c.jpg")) },
  @{ id="34000000-0000-4000-8000-000000000009"; pos=4; prompt="Which is Jill's bedroom?"; ans=@{ option="b" }; opts=@(@("a", "Room with TV", "q4-a.jpg"), @("b", "Room with 2 beds", "q4-b.jpg"), @("c", "Room with 1 bed", "q4-c.jpg")) },
  @{ id="34000000-0000-4000-8000-000000000010"; pos=5; prompt="Which is Nick's brother?"; ans=@{ option="a" }; opts=@(@("a", "Boy with glasses", "q5-a.jpg"), @("b", "Boy eating burger", "q5-b.jpg"), @("c", "Boy with camera", "q5-c.jpg")) }
)

foreach ($q in $qS2) {
  $qRow = @{ id=$q.id; quiz_id=$quizId; section_id=$s2Id; position=$q.pos; question_type="image_choice"; prompt=$q.prompt; points=1; metadata=@{} }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($qRow | ConvertTo-Json -Depth 5)))
  
  $dh = @{ "apikey"=$serviceKey; "Authorization"="Bearer $serviceKey" }
  try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options?question_id=eq.$($q.id)" -Method Delete -Headers $dh } catch {}
  
  $optRows = @()
  $p = 1
  foreach ($o in $q.opts) {
    $optRows += @{ question_id=$q.id; option_key=$o[0]; option_text=$o[1]; image_url="$assetBase/images/listening/$($o[2])"; position=$p }
    $p++
  }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($optRows | ConvertTo-Json -Depth 5)))
  
  $keyRow = @{ question_id=$q.id; answer=$q.ans }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/answer_keys?on_conflict=question_id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($keyRow | ConvertTo-Json -Depth 5)))
}
Write-Host "Section 2 questions inserted."

# Section 3 (single_choice)
$colorOpts = @(@("a", "Brown"), @("b", "Pink"), @("c", "Yellow"), @("d", "Orange"), @("e", "Green"), @("f", "Blue"), @("g", "Red"))
$qS3 = @(
  @{ id="34000000-0000-4000-8000-000000000011"; pos=1; prompt="What color is the cake in the cupboard?"; ans=@{ option="a" } },
  @{ id="34000000-0000-4000-8000-000000000012"; pos=2; prompt="What color is the cake in the boy's hand?"; ans=@{ option="b" } },
  @{ id="34000000-0000-4000-8000-000000000013"; pos=3; prompt="What color is the small girl's cake?"; ans=@{ option="c" } },
  @{ id="34000000-0000-4000-8000-000000000014"; pos=4; prompt="What color is the cake on the mat?"; ans=@{ option="d" } },
  @{ id="34000000-0000-4000-8000-000000000015"; pos=5; prompt="What color is the cake in front of the cat?"; ans=@{ option="e" } },
  @{ id="34000000-0000-4000-8000-000000000016"; pos=6; prompt="What color is the cake next to the girl's mother?"; ans=@{ option="f" } }
)

foreach ($q in $qS3) {
  $qRow = @{ id=$q.id; quiz_id=$quizId; section_id=$s3Id; position=$q.pos; question_type="single_choice"; prompt=$q.prompt; points=1; metadata=@{} }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?on_conflict=id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($qRow | ConvertTo-Json -Depth 5)))
  
  $dh = @{ "apikey"=$serviceKey; "Authorization"="Bearer $serviceKey" }
  try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options?question_id=eq.$($q.id)" -Method Delete -Headers $dh } catch {}
  
  $optRows = @()
  $p = 1
  foreach ($o in $colorOpts) {
    $optRows += @{ question_id=$q.id; option_key=$o[0]; option_text=$o[1]; position=$p }
    $p++
  }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($optRows | ConvertTo-Json -Depth 5)))
  
  $keyRow = @{ question_id=$q.id; answer=$q.ans }
  Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/answer_keys?on_conflict=question_id" -Method Post -Headers $h -Body ([System.Text.Encoding]::UTF8.GetBytes(($keyRow | ConvertTo-Json -Depth 5)))
}
Write-Host "Section 3 questions inserted."
Write-Host "Successfully imported Test 4!"
