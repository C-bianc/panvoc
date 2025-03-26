#!/usr/bin/env python
# ~* coding: utf-8 *~
import requests
from bs4 import BeautifulSoup
import time
import json
filename = "liste_liens_finale.txt" 

with open(filename, "r") as file:
    links = [line.strip() for line in file]



links = set(links)

print("after set : ", len(links))



logs = open("logs.txt", 'w')
# html structure
# | DEFINITION PAGE |


# pos_section
# |__pos_header => headword, pos
# |__info sense
# |__|__sense_title hidingTitle
# |____|__info body
# |____|__|_label label-+'CEFR'
# |____|__|_definition
# |____|__|__|_blockquote
# |____|__|__|_learnerexamp


def get_definitions(word, pos):
    levels = {}
    current_pos = pos.find(class_="pos").text.strip()

    for info_sense in pos.find_all(class_="info sense"):
        title = info_sense.find(class_="sense_title").text.strip()
        word_with_sense = title.split('(')[0].strip()
        sense_content = title.split('(')[-1].replace(')', '').strip().lower()

        if word.lower() == word_with_sense.lower():
            level = info_sense.find(class_="label").text.strip()

            if level not in levels:
                levels[level] = {}

            definition = info_sense.find(class_="definition").text.strip()

            example = None

            # get dict exampels if any
            dict_examples = info_sense.find('div', class_='example')
            if dict_examples:
                dict_p_blockquotes = dict_examples.find_all('p', class_='blockquote')
                for p_blockquote in dict_p_blockquotes:
                    if word in p_blockquote.get_text():
                        colloc = p_blockquote.find('span', class_='collo')
                        if colloc:
                            colloc = colloc.get_text()
                            example = p_blockquote.get_text(strip=True).replace(word, "...")
                            example = example.replace(colloc, f" {colloc} ")
                        else:
                            example = p_blockquote.get_text(strip=True).replace(word, "...")
                        break

            # If no dictionary example found, extract learner examples
            else:
                print("No dict examples, extracting learner's")
                learner_examples = info_sense.find('div', class_='learner')
                if learner_examples:
                    learner_p_blockquotes = learner_examples.find_all('p', class_='learnerexamp')
                    for p_blockquote in learner_p_blockquotes:
                        if word in p_blockquote.get_text():
                            colloc = p_blockquote.find('span', class_='collo')
                            if colloc:
                                colloc = colloc.get_text()
                                example = p_blockquote.get_text(strip=True).replace(word, "...")
                                example = example.replace(colloc, f" {colloc} ")
                            else:
                                example = p_blockquote.get_text(strip=True).replace(word, "...")
                        break

            if "definitions" not in levels[level]:
                            levels[level]["definitions"] = []

            levels[level]["definitions"].append({
                "sense": sense_content if sense_content != word_with_sense else "literal sense",
                "definition": definition,
                "example": example
            })

    return levels

def generate_db(links):
    words_data = []

    for i, link in enumerate(links):

        response = requests.get(link)

        # get html content
        html_content = response.text


        # parse the html
        soup = BeautifulSoup(html_content, 'html.parser')

        try:
            word = soup.find('span', class_='headword').get_text(strip=True)
        except:
            print("Error", link)
            logs.write(link)
            logs.write("\n")
            continue
        
        print("Scraping ",f'<{word}>')
        definitions = {}

        word_info = {
            'word': word,
            'levels': {}  
        }
        try:
            # extract information for each pos_section
            for pos_section in soup.find_all(class_="pos_section"):
                definitions_per_level = get_definitions(word, pos_section)
                definitions.update(definitions_per_level)
                
            word_info['levels'].update(definitions)
            words_data.append(word_info)

            time.sleep(1)
        except Exception as e:
            logs.write("error : ", e)
            logs.write("\n")
            logs.write("for link : ",link)
            logs.write("\n")
            continue

    print(json.dumps(words_data, indent=2))
    return json.dumps(words_data)

start_time = time.time()
json_data = generate_db(links)

# write to file
with open ("data_output.json", "w") as output_file:
    json.dump(json_data, output_file)


print("Scrapped succesfully.")
logs.close()
end_time = (time.time() - start_time) / 60

print(f"Database generated in {end_time:.2f} mins") 
