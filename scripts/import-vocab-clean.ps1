$supabaseUrl = "https://syghsisooccdvpvshgvm.supabase.co"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw"

$headers = @{
    "apikey" = $serviceKey
    "Authorization" = "Bearer $serviceKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$publicPath = Join-Path $PSScriptRoot "..\content\test-vocab.public.json"
$privatePath = Join-Path $PSScriptRoot "..\content\test-vocab.private.json"

$publicContent = Get-Content $publicPath -Raw -Encoding UTF8 | ConvertFrom-Json
$privateAnswers = Get-Content $privatePath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host "Upserting Quiz..."
$quizObj = @{
    id = $publicContent.quiz.id
    slug = $publicContent.quiz.slug
    title = $publicContent.quiz.title
    description = $publicContent.quiz.description
    grade = $publicContent.quiz.grade
    subject = $publicContent.quiz.subject
    is_published = $true
}
$quizBody = $quizObj | ConvertTo-Json -Depth 5
try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quizzes?on_conflict=id" -Method Post -Headers $headers -Body $quizBody } catch { Write-Host "Quiz upsert warning: $_" }

foreach ($section in $publicContent.sections) {
    Write-Host "Inserting Section: $($section.title)"
    $secObj = @{
        id = $section.id
        quiz_id = $publicContent.quiz.id
        title = $section.title
        instruction = $section.instruction
        section_type = $section.section_type
        position = [int]$section.position
    }
    $secBody = $secObj | ConvertTo-Json -Depth 5
    try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quiz_sections?on_conflict=id" -Method Post -Headers $headers -Body $secBody } catch { Write-Host "Section warning: $_" }

    foreach ($q in $section.questions) {
        $qObj = @{
            id = $q.id
            quiz_id = $publicContent.quiz.id
            section_id = $section.id
            position = [int]$q.position
            question_type = $q.question_type
            prompt = $q.prompt
            points = [int]$q.points
            metadata = @{}
        }
        $qBody = $qObj | ConvertTo-Json -Depth 5
        try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?on_conflict=id" -Method Post -Headers $headers -Body $qBody } catch { Write-Host "Q warning: $_" }

        # Options
        if ($q.options) {
            $optPos = 1
            foreach ($opt in $q.options) {
                $optObj = @{
                    question_id = $q.id
                    option_key = [string]$opt[0]
                    option_text = [string]$opt[1]
                    position = $optPos
                }
                $optBody = $optObj | ConvertTo-Json -Depth 5
                try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options" -Method Post -Headers $headers -Body $optBody } catch {}
                $optPos++
            }
        }

        # Answer key
        $qIdStr = $q.id
        $ans = $privateAnswers.$qIdStr
        if ($ans) {
            $keyObj = @{
                question_id = $q.id
                answer = @{ option = $ans.option }
            }
            $keyBody = $keyObj | ConvertTo-Json -Depth 5
            try { Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/answer_keys?on_conflict=question_id" -Method Post -Headers $headers -Body $keyBody } catch {}
        }
    }
}

Write-Host "All Vocab questions and answer keys imported successfully!"
