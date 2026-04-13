const fs = require('fs');

const rawData = `A. B. Guthrie
The Way West
1949
[1]
A. Madhavan
Ilakkiya Suvadugal (Essays)
2015
[2]
A. R. Venkatachalapathy
Tirunelveli Ezucciyum Vaa. Vuu.Ci. Yum 1908 (Research)
2024
[2]
A. S. Byatt
Possession: a Romance
1990
[3]
A.K. Ramanujan
The Collected Poems of A.K. Ramanujan (Poetry)
1999
[2]
A.O. Memchoubi
Edu Mtngthou (Poetry)
2008
[2]
Aaidan Singh Bhati
Aankh Hinye Ra Hariyal Sapana (Poetry)
2012
[2]
Abburi Chayadevi
Tana Margam (Short Stories)
2005
[2]
Abhishap
Lalsa (Poetry)
1995
[2]
Abul Kalam Qasmi
Ma-assirTanquidi Nazmein (Poetry)
2009
[2]
Adam Haslett
You Are Not a Stranger Here
2003
[1]
Adam Haslett
Imagine Me Gone
2017
[1]
Adam Johnson
The Orphan Master's Son
2013
[1]
Adania Shibli
Minor Detail
2021
[4]
Adil Jussawalla
Trying to Say Goodbye (Poetry)
2014
[2]
Aditya Kumar Mandi
Banchao Larhai (Poetry)
2011
[2]
Afsar Ahmed
Sei Nikhouj Manusta (Novel)
2017
[2]
Ahmed Saadawi
Frankenstein in Baghdad
2018
[4]
Ajanta (P.V. Shastri)
Swapna Lipi (Poetry)
1997
[2]
Ajit Azad
Pen-Drive Me Prithvi (Poetry)
2022
[2]
Ajmer Singh Aulakh
Ishk Baj Namaz Da Haz Nahi (Plays)
2006
[2]
Akhlaq Mohammed Khan
Khwab Ka Dar Band Hai(Urdu)
2008
[5]
Aki Ollikainen
White Hunger
2016
[4]
Akkitham Achuthan Namboothiri
For Malayalam Literature
2019
[5]
Alan Hollinghurst
The Line of Beauty
2004
[3]
Alai Mabanckou
Black Moses
2017
[4]
Alia Trabucco Zeran
The Remainder
2019
[4]
Alice McDermott
That Night
1988
[1]
Alice McDermott
At Weddings and Wakes
1993
[1]
Alice McDermott
After This
2007
[1]
Alice Walker
The Color Purple
1983
[1]
Ali Sardar Jafri
My Words & Thoughts
1997
[5]
Ali Shaida
Najdavanek'y Pot Aalav (Poetry)
2025
[2]
Alison Lurie
Foreign Affairs
1985
[1]
Alka Saraogi
Kali-Katha : Via Bypass (Novel)
2001
[2]
Allen Drury
Advise and Consent
1959
[1]
Alok Sarkar
Shono Jabaphul (Poetry)
2015
[2]
Amar Kant
Inhin Hathiyaron Se(Hindi)
2009
[5]
Amar Kant
Inhin Hathiyaron Se (Novel)
2007
[2]
Amar Mitra
Dhrubaputra (Novel)
2006
[2]
Ambai
Civappuk Kazuttu Tan Oru Paccaip Paravai (Short Stories)
2021
[2]
Ambika Dutt
Aanthyoi Nahi Din Hal (Poetry)
2013
[2]
Amaresh Nugadoni
Dada Seerisu Tande (Short Stories)
2025
[2]
Amit Chaudhuri
A New World (Novel)
2002
[2]
Amitav Ghosh
The Circle of Reason
2018
[5]
Amrita Pritam
Kagaz te canvas (Punjabi)
1981
[5]
Amritlal Vegad
Saundaryani Nadi Narmada (Travelogue)
2004
[2]
Amos Oz
Judas
2017
[4]
Ana Paula Maia
On Earth As It Is Beneath
2026
[4]
Anamika
Tokri Mein Digant 'Their Gatha' : 2014 (Poetry)
2020
[2]
Anand (P. Satchidanandan)
Govardhante Yatrakal (Novel)
1997
[2]
Anand Khemani
Rishtan Jee Siyasat (Short Stories)
2009
[2]
Andrea Barrett
Servants of the Map: Stories
2003
[1]
Andrew Sean Greer
Less
2018
[1]
Andrey Kurkov
Jimi Hendrix Live In Lviv
2023
[4]
Andrey Kurkov
The Silver Bone
2024
[4]
Andrzej Tichá
Wretchedness
2021
[4]
Anees Salim
The Blind Lady's Descendants (Novel)
2018
[2]
Anet Daanje
The Remembered Soldier
2026
[4]
Anil Boro
Delphini Onthai Mwdai Arw Gubun Gubun Khonthai (Poetry)
2013
[2]
Anis Ashfaq
Khwab Saraab (Novel)
2022
[2]
Anita Brookner
Hotel du Lac
1984
[3]
Anju (Anjali Narzary)
Ang Maboroi Dong Dasong (Poetry)
2016
[2]
Ann Patchett
The Dutch House
2020
[1]
Anna Burns
Milkman
2018
[3]
Anne Enright
The Gathering
2007
[3]
Anne Serre
A Leopard-Skin Hat
2025
[4]
Anne Tyler
Dinner at the Homesick Restaurant
1983
[1]
Anne Tyler
The Accidental Tourist
1986
[1]
Anne Tyler
Breathing Lessons
1989
[1]
Annie Ernaux
The Years
2019
[4]
Annie Proulx
The Shipping News
1994
[1]
Annie Proulx
Close Range: Wyoming Stories
2000
[1]
Anthony Doerr
All the Light We Cannot See
2015
[1]
Antonio Muñoz Molina
Like a Fading Shadow
2018
[4]
Anuradha Patil
Kadachit Ajoonahi (Poetry)
2019
[2]
Anuradha Roy
All The Lives We Never Lived (Novel)
2022
[2]
Anuradha Sarma Pujari
Iyat Ekhan Aaranya Asil (Novel)
2021
[2]
Apurba Kumar Saikia
Bengsata (Short Stories)
2020
[2]
Apurba Sarma
Baghe Tapur Rati (Short stories)
2000
[2]
Arambam Somorendra Singh
Leipaklei (Play)
1995
[2]
Aravind Adiga
The White Tiger
2008
[3]
Ariana Harwicz
Die, My Love
2018
[4]
Arjun Chawla
Nena Nindakhra (Poetry)
2021
[2]
Arjun Charan Hembram
Chanda Bonga (Poetry)
2013
[2]
Aron Raja
Swrni Thakhai (Novel)
2024
[2]
Arun Kamal
Naye Ilake Mein (Poetry)
1998
[2]
Arun Khopkar
Chalat-Chitravyoolh (Memoirs)
2015
[2]
Arun Kolatkar
Bhijaki Vahi (Poetry)
2005
[2]
Arun Ranjan Mishra
Shunye Meghganam (Poetry)
2023
[2]
Arun Sakhardande
Kayallyachem Sraddha (Poetry)
2010
[2]
Arun Sarma
Asirbadar Rang (Novel)
1998
[2]
Arundhathi Subramaniam
When God Is a Traveller (Poetry)
2020
[2]
Arundhati Roy
The God of Small Things
1997
[3]
Arundhati Roy
The Algebra of Infinite Justice (Essays)
2005
[2]
Arupa Patangia Kalita
Mariam Astin Athaba Hira Barua(Short Stories)
2014
[2]
Asaram Lomate
Aalok (Short Stories)
2016
[2]
Asha Bage
Bhoomi (Novel)
2006
[2]
Asha Mishra
Uchat (Novel)
2014
[2]
Ashok Kamat
Ghanaghai Niyatiche (Novel)
2008
[2]
Ashok R. Kelkar
Rujuvat-Asvad : Samiksha : Mimamsa (Criticism)
2010
[2]
Ashok Vajpeyi
Kahin Nahin Wahin (Poetry)
1994
[2]
Ashokpuri Goswami
Kuvo (Novel)
1997
[2]
Ashutosh Parida
Aprastuta Mrutyu (Poetry)
2023
[2]
Ashvani Magotra
Jhull Bada Dea Pattara (Poetry)
2003
[2]
Ashvin Mehta
Chhabi Bhitarani (Essays)
2014
[2]
Astrid Roemer
On a Woman’s Madness
2025
[4]
Atamjit
Tatti Tavi Da Sach (Play)
2009
[2]
Ateequllah
Bain-Ul-Uloomi Tanqued (Criticism)
2024
[2]
Atin Bandyopadhyaya
Panchashati Galpa (Short stories)
2001
[2]
Attoor Ravi Varma
Attoor Ravi Varmayute Kavitakal (Poetry)
2001
[2]
Atul Kanakk
Joon-Jatra (Novel)
2011
[2]
Atulananda Goswami
Cheneh Jorir Ganthi (Short stories)
2006
[2]
Aurobindo Uzir
Swdbwni Swler (Poetry)
2010
[2]
Autar Krishen Rahbar
Yeli Parda Woth (Short Stories)
2017
[2]
Aziz Hajini
Aane Khane (Criticism)
2016
[2]
B. C. Ramachandra Sharma
Sapthapadi (Poetry)
1998
[2]
B. M. Maisnamba
Imasi Nurabee (Novel)
2007
[2]
Babuajee Jha 'Ajnat'
Pratijna Pandav (Epic)
2001
[2]
Bachchoolal Awasthi
Pratanini (Poetry)
1998
[2]
Badal Hembram
Manmi (Short Stories)
2008
[2]
Badri Narayan
Tumadi Ke Shabd (Poetry)
2022
[2]
Badrinath Chaturvedi
The Mahabharata : An Inquiry in the Human Condition (Critical Analysis)
2009
[2]
Baig Ehsas
Dakhma (Short Stories)
2017
[2]
Baishnab Charan Samal
Bhuti Bhakti Bibhuti (Essays)
2024
[2]
Bal Krishan 'Bhaura'
Tim-Tim Karde Tare (Poetry)
2012
[2]
Baldev Singh
Dhaawaan Dilli De Kingrey (Novel)
2011
[2]
Balivada Kantha Rao Kathalu
Balivada Kantha Rao Kathalu (Short Stories)
1998
[2]
Bandhu Sharma
Meel Patthar (Short stories)
2000
[2]
Bandi Narayana Swamy
Septabhoomi (Novel)
2019
[2]
Bani Basu
Khanamihiro Dhipi (Novel)
2010
[2]
Bansidhar Sarangi
Swarodaya (Poetry)
2006
[2]
Banu Mushtaq
Heart Lamp
2025
[4]
Barbara Kingsolver
The Poisonwood Bible
1999
[1]
Barbara Kingsolver
Demon Copperhead
2023
[1]
Barry Unsworth
Sacred Hunger
1992
[3]
Basher Bashir
Yiman Padan Mye Vetsaar Gotshuy (Criticism)
2010
[2]
Bashir Bhadarwahi
Jamis Ta Kasheeri Manz Kashir Natia Adabuk Tawareekh (Criticism)
2015
[2]
Bashir Badr
Aas (Poetry)
1999
[2]
Basukinath Jha
Bodha Sanketan (Essays)
2023
[2]
Ben Lerner
The Topeka School
2020
[1]
Ben Okri
The Famished Road
1991
[3]
Benjamín Labatut
When We Cease to Understand the World
2021
[4]
Bernard Malamud
The Fixer
1966
[1]
Bernardine Evaristo
Girl, Woman, Other
2019
[3]
Bernice Rubens
The Elected Member
1970
[3]
Bhalchandra Nemade
Kosala(Marathi)
2014
[5]
Bhanwar Singh Samour
Sanskriti Ri Sanatan Deeth (Essays)
2020
[2]
Bharat Ola
Jiv Ri Jaat (Short Stories)
2002
[2]
Bhaskaracharya Tripathi
Nirjharini (Poetry)
2003
[2]
Bhim Dahal
Droha (Novel)
2006
[2]
Bhogla Soren
Rahi Ranwak' Kana (Play)
2010
[2]
Bhujanga Tudu
Tahena.n Tangi re (Poetry)
2017
[2]
Bibhuti Anand
Kaath (Short Stories)
2006
[2]
Bibhuti Pattanaik
Mahishasurara Muhan (Short Stories)
2015
[2]
Bidyasagar Narzary
Birgwsrini Thungri (Novel)
2008
[2]
Bijoy Misra
Banaprastha (Play)
2013
[2]
Bikram Bir Thapa
Bishaun Shatabdi Ki Monalisa (Short stories)
1999
[2]
Bina Hangkhim
Kriti Vimarsha (Literary Criticism)
2017
[2]
Bina Thakur
Parineeta (Short Stories)
2018
[2]
Binay Mazumdar
Haspatale Lekha Kabitaguchha (Poetry)
2005
[2]
Bindu Bhatt
Akhepatar (Novel)
2003
[2]
Bindya Subba
Athah (Novel)
2003
[2]
Birendrajit Naorem
Lanthengnariba Lanmee (Poetry)
2004
[2]
Bireswar Barua
Anek Manuh Anek Aru Nirjanata (Poetry)
2003
[2]
Bob Shacochis
The Woman Who Lost Her Soul
2014
[1]
Boluwaru Mohammad Kunhi
Swatantryada Ota (Novel)
2016
[2]
Booth Tarkington
The Magnificent Ambersons
1918
[1]
Booth Tarkington
Alice Adams
1921
[1]
Bora Chung
Cursed Bunny
2022
[4]
Brajendra Kumar Brahma
Baidi Dengkhw Baidi Gab (Poetry)
2015
[2]
Bratya Basu
Mirjafar O Ananya Natale (Play)
2021
[2]
Budhichandra Heisnamba
Ngamkheigee Wangmada (Short Stories)
2018
[2]
Bulaki Sharma
Murdjat Ar Dujee Kahaniyan (Short Stories)
2016
[2]
C. E. Morgan
The Sport of Kings
2017
[1]
C. N. Ramachandran
Akyana-Vyakyana (Essays)
2013
[2]
C. V. Sreeraman
Sreeramante Kathakal (Short Stories)
1999
[2]
Can Xue
Love in the New Millennium
2019
[4]
Can Xue
I Live in the Slums
2021
[4]
Carol Shields
The Stone Diaries
1995
[1]
Caroline Miller
Lamb in His Bosom
1933
[1]
Chaim Grade
Rabbis and Wives
1983
[1]
Champa Sharma
Cheten Di Rhol (Poetry)
2008
[2]
Chandana Goswami
Patkair Ipare Mor Desh (Novel)
2012
[2]
Chander Bhan Khayal
Taza Hawa Ki Tabishen (Poetry)
2021
[2]
Chandrabhanu Singh
Shakuntala (Epic)
2004
[2]
Chandrakant Devtale
Patthar Fenk Raha Hoon (Poetry)
2012
[2]
Chandrakant Topiwala
Sakshibhasya (Criticism)
2012
[2]
Chandrashekhara Kambara
For Kannada Literature
2010
[5]
Chandrasekhar Rath
Sabutharu Dirgharati (Short stories)
1997
[2]
Chandra Prasad Saikia
Maharathi (Novel)
1995
[2]
Chang-rae Lee
The Surrendered
2011
[1]
Charan Dass Sidhu
Bhagat Singh Shahid : Natak Tikri (Play)
2003
[2]
Chekuri Rama Rao
Smrti Kinankam (Essays)
2002
[2]
Cheon Myeong-kwan
Whale
2023
[4]
Chetan Swami
Kisturi Mirag (Short Stories)
2005
[2]
Chhabilal Upadhyaya
Usha Anirudha (Epic Poetry)
2021
[2]
Chhatrapal
Cheta (Short Stories)
2016
[2]
Chinmoy Guha
Ghumer Darja Thele (Essays)
2019
[2]
Chinu Modi
Khara Zaran (Poetry)
2013
[2]
Chitiprolu Krishna Murthy
Purushothamudu (Poetry)
2008
[2]
Chitra Mudgal
Post Box No. 203-Naala Sopara (Novel)
2018
[2]
Chitta Ranjan Das
Biswaku Gabakhya (Criticism)
1998
[2]
Cho. Dharman
Sool (Novel)
2019
[2]
Christian Kracht
Eurotrash
2025
[4]
Christine Schutt
All Souls
2009
[1]
Claudia Piñeiro
Elena Knows
2022
[4]
Clemens Meyer
Bricks and Mortar
2017
[4]
Clemens Meyer
While We Were Dreaming
2023
[4]
Colson Whitehead
John Henry Days
2002
[1]
Colson Whitehead
The Underground Railroad
2017
[1]
Colson Whitehead
The Nickel Boys
2020
[1]
Conrad Richter
The Town
1950
[1]
Cormac McCarthy
The Road
2007
[1]
Cyrus Mistry
Chronicle of a Corpse Bearer (Novel)
2015
[2]
D. B. C. Pierce
Vernon God Little
2003
[3]
D. Jayakanthan
For Tamil Literature
2002
[5]
D. S. Nagabhushana
Gandhi Kathana (Biography)
2021
[2]
D. Selvaraj
Thol (Novel)
2012
[2]
Dahlia de la Cerda
Reservoir Bitches
2025
[4]
Damador Mauzo
For Konkani Literature
2022
[5]
Damayanti Beshra
Say Sahed (Poetry)
2009
[2]
Damon Galgut
The Promise
2021
[3]
Daniel Kehlmann
Tyll
2020
[4]
Daniel Kehlmann
The Director
2026
[4]
Daniel Mason
A Registry of My Passage Upon the Earth
2021
[1]
Daniyal Mueenuddin
In Other Rooms, Other Wonders
2010
[1]
Darshan Buttar
Maha Kambani (Poetry)
2012
[2]
Darshan Darshi
Kore kaakal Korian Talian (Poetry)
2006
[2]
Dasarathi Das
Prasanga Puruna Bhabana Nua (Literary Criticism)
2018
[2]
Datta Damodar Naik
Jai Kai Jui (Essays)
2006
[2]
Dattatreya Ramachandra Bendre
NakuThanthi (Kannada)
1973
[5]
David Diop
At Night All Blood Is Black
2021
[4]
David Foster Wallace
The Pale King
2012
[1]
David Gates
Jernigan
1992
[1]
David Grossman
A Horse Walks into a Bar
2017
[4]
David Grossman
More Than I Love My Life
2022
[4]
David Storey
Saville
1976
[3]
Daya Prakash Sinha
Samrat Ashok (Play)
2021
[2]
Denis Johnson
Tree of Smoke
2008
[1]
Denis Johnson
Train Dreams
2012
[1]
Dev
Shabdant (Poetry)
2001
[2]
Devabrat Das
Karhi Khelar Sadhu (Novel)
2025
[2]
Devidas Kadam
Dika (Novel)
2007
[2]
Devipriya
Gaali Rangu (Poetry)
2017
[2]
Dhian Singh
Parchhamen Di Lo (Poetry)
2015
[2]
Dhirendra Mehta
Chhavani (Novel)
2010
[2]
Dhiruben Patel
Agantuk (Novel)
2001
[2]
Dholan 'Rahi'
Andhero Roshan Thiye (Poetry)
2005
[2]
Dhruba Jyoti Bora
Katha Ratnakara (Novel)
2009
[2]
Dhruv Prabodhrai Bhatt
Tattvamasi (Novel)
2002
[2]
Diana O'Hehir
I Wish This War Were Over
1985
[1]
Diane Johnson
Persian Nights
1988
[1]
Dileep Jhaveri
Bhagwan-ni Vato (Poetry)
2024
[2]
Dilip Borkar
Gomanchal Te Himachal (Travelogue)
1995
[2]
Dilip Chitre
Ekun Kavita-I (Poetry)
1994
[2]
Dinesh Panchal
Pagarva (Short Stories)
2008
[2]
Dipak Kumar Sharma
Bhaskaracaritam (Poetry)
2024
[2]
Dipak Mishra
Sukha Sanhita (Poetry)
2007
[2]
Dom Moraes
Serendip (Poetry)
1994
[2]
Domenico Starnone
The House on Via Gemito
2024
[4]
Don DeLillo
Mao II
1992
[1]
Don DeLillo
Underworld
1998
[1]
Donald Barthelme
Paradise
1987
[1]
Donna Tartt
The Goldfinch
2014
[1]
Dorthe Nors
Mirror, Shoulder, Signal
2017
[4]
Douglas Stuart
Shuggie Bain
2020
[3]
Douglas Unger
Leaving the Land
1985
[1]
Dr. C. Narayana Reddy
Visvambara (Telugu)
1988
[5]
Dr. O. N. V. Kurup
For Malayalam Literature
2007
[5]
Dr. Raghuvir Chaudhari
For Gujarati Literature
2015
[5]
Dr. Sachchidananda Hirananda Vatsyayana (Agyeya)
Kitni Nawon Mein Kitni Bar (Hindi)
1978
[5]
E. Annie Proulx
The Shipping News
1994
[1]
E. L. Doctorow
Billy Bathgate
1990
[1]
E. L. Doctorow
The March
2006
[1]
E. V. Ramakrishnan
Malayala Novelinte Deshakalangal (Literary Study)
2023
[2]
Easterine Kire
Spirit Nights (Novel)
2024
[2]
Ed Park
Same Bed Different Dreams
2024
[1]
Edith Wharton
The Age of Innocence
1920
[1]
Edna Ferber
So Big
1924
[1]
Edward P. Jones
The Known World
2004
[1]
Edwin J.F.D'Souza
Kale Bhangar (Novel)
2016
[2]
Edwin O'Connor
The Edge of Sadness
1961
[1]
Eka Kurniawan
Man Tiger
2016
[4]
Eleanor Catton
The Luminaries
2013
[3]
Elena Ferrante
The Story of the Lost Child
2016
[4]
Elif Batuman
The Idiot
2018
[1]
Elizabeth Strout
Olive Kitteridge
2009
[1]
Ellen Glasgow
In This Our Life
1941
[1]
Emmanuelle Pagano
Faces on the Tip of My Tongue
2020
[4]
Enrique Vila-Matas
Mac and His Problem
2020
[4]
Eowyn Ivey
The Snow Child
2013
[1]
Éric Vuillard
The War of the Poor
2021
[4]
Ernest Hemingway
The Old Man and the Sea
1952
[1]
Ernest Poole
His Family
1917
[1]
Esther David
Book of Rachel (Novel)
2010
[2]
Eudora Welty
The Optimist's Daughter
1972
[1]
Eva Baltasar
Boulder
2023
[4]
Farooq Fayaz
Zael Dab (Literary Criticism)
2022
[2]
Fernanda Melchor
Hurricane Season
2020
[4]
Fernanda Melchor
Paradais
2022
[4]
Fiston Mwanza Mujila
Tram 83
2016
[4]
Francisco Goldman
Monkey Boy
2022
[1]
Frederick Buechner
Godric
1981
[1]
G. H. Nayak
Uttarardha (Essays)
2014
[2]
G. M. Pawar
Maharshi Vitthal Ramaji Shinde: Jeevan Va Karya (Biography)
2007
[2]
G. Sankara Kurup
Auda Kujai (Malayalam)
1965
[5]
G. S. Amur
Bhuvanada Bhagya (Literary criticism)
1996
[2]
G. S. Amur
Bhuvanada Bhagya (Literary criticism)
1996
[2]
G. Thilakavathi
Kalmaram (Novel)
2005
[2]
Gabriela Cabezón Cámara
The Adventures of China Iron
2020
[4]
Gabriela Cabezón Cámara
We Are Green and Trembling
2026
[4]
Gabriela Wiener
Undiscovered
2024
[4]
Gabriela Ybarra
The Dinner Guest
2018
[4]
Gagan Gill
Main Jab Tak Aai Bahar (Poetry)
2024
[2]
Gaëlle Bélem
There’s a Monster Behind the Door
2025
[4]
Gajanan Jog
Khand Ani Her Katha (Short Stories)
2017
[2]
Gaje Singh Rajpurohit
Palakati Preet (Poetry)
2023
[2]
Gangadhar Gadgil
Eka Mungiche Mahabharat (Autobiography)
1996
[2]
Gangadhar Hansda
Banchao Akan Goj Hor (Short Stories)
2012
[2]
Gangesh Gunjan
Uchitavakta (Short stories)
1994
[2]
GauZ’
Standing Heavy
2023
[4]
Gayatribala Panda
Dayanadi (Poetry)
2022
[2]
Gayatri Saraf
Etavatira Shilpi (Short Stories)
2017
[2]
Gayl Jones
Palmares
2022
[1]
Gayl Jones
The Unicorn Woman
2025
[1]
Geetanjali Shree
Tomb of Sand
2022
[4]
Geetha Nagabhushana
Baduku (Novel)
2004
[2]
George Onakkoor
Hrudayaragangal (Autobiography)
2021
[2]
George Saunders
Lincoln on the Bardo
2017
[3]
Georgi Gospodinov
Time Shelter
2023
[4]
Geraldine Brooks
March
2006
[1]
Gh. Nabi Firaq
Sada Te Samandar (Poetry)
2004
[2]
Ghulam Nabi Aatash
Baazyaafat (Criticism)
2008
[2]
Gian Singh Pagoch
Mahatma Vidur (Epic)
2007
[2]
Gian Singh Shatir
Gian Singh Shatir (Novel)
1997
[2]
Gianeshwar
Baddali Kalave (Poetry)
1996
[2]
Girijakumar Baliyar Singh
Padapurana (Poetry)
2025
[2]
Girish Karnad
For Kannada Literature
1998
[5]
Girish Karnad
Taledanda (Play)
1994
[2]
Gobinda Chandra Majhi
Nalha (Poetry)
2016
[2]
Gokuldas Prabhu
Antarayami (Short Stories)
1994
[2]
Gopalakrishna Pai
Swapna Saraswata (Novel)
2011
[2]
Gopalkrushna Rath
Bipula Diganta (Poetry)
2014
[2]
Gope Kamal
Sija Agyaan Buku (Poetry)
2014
[2]
Gopi Chand Narang
Sakhtiyat, Pas-Sakhtiyat Aur Mashriqi Sheriyat (Literary Criticism)
1995
[2]
Gopi Narayan Pradhan
Akashlay Pani Thawan Khoji Rahehcha (Poetry)
2010
[2]
Gopinath Mohanty
Mati Matal (Oriya)
1973
[5]
Gorati Venkanna
Vallankitaalam (Poetry)
2021
[2]
Gourahari Das
Kanta O' Anyanya Galpa (Short Stories)
2012
[2]
Govind Charan Patnaik
Kavyaslipi Gangadhara (Criticism)
1995
[2]
Govind Mishra
Kohre Mein Kaid Rang (Novel)
2008
[2]
Grace (Manik Godghate)
Varyane Halate Raan (Essays)
2011
[2]
Grace Paley
The Collected Stories
1995
[1]
Graham Swift
Last Orders
1996
[3]
Guadalupe Nettel
Still Born
2023
[4]
Gulam Mohammad Shaikh
Gher Jatan (Autobiographical Essays)
2022
[2]
Gulzar
Dhuan (Short Stories)
2002
[2]
Guneswar Musahary
Boro Khonthai (Poetry)
2012
[2]
Gunturu Seshendra Sharma
Kala Rekha (Criticism)
1994
[2]
Gupta Pradhan
Samayaka Prativimbarahu (Short Stories)
2015
[2]
Gurbachan Singh Bhullar
Agni-Kalas (Short Stories)
2005
[2]
Gurdev Singh Rupana
Aam Khass (Short Stories)
2020
[2]
Gurdial Singh
Chabara (room on the terrace)
1999
[5]
Guru Charan Patnaik
Jagata Darshanare Jagannatha (Cultural Study)
1994
[2]
Gyanendrapati
Sanshyatma (Poetry)
2006
[2]
Ha Jin
Waiting
2000
[1]
Ha Jin
War Trash
2005
[1]
Haiman Das Rai 'Kirat'
Kehi Namileka Rekhaharu (Short Stories)
2008
[2]
Hamidi Kashmiri
Yath Miani Joye (Poetry)
2005
[2]
Han Kang
The Vegetarian
2016
[4]
Han Kang
The White Book
2018
[4]
Haobam Nalini
Kanglamdriba Eephut (Short Stories)
2025
[2]
Haobam Satyabati Devi
Mainu Bora Nungshi Sheirol (Poetry)
2024
[2]
Haraprasad Das
Garbhagriha (Poetry)
1999
[2]
Harbhajan Singh Halwarvi
Pulaan Ton Paar (Poems)
2002
[2]
Harekrishna Satapathy
Bharatayanum (Poetry)
2011
[2]
Harikrishna Kaul
Yath Raaz Danay (Short Stories)
2000
[2]
Harish Meenashru
Banaras Diary (Poetry)
2020
[2]
Harold L. Davis
Honey in the Horn
1935
[1]
Harper Lee
To Kill a Mockingbird
1960
[1]
Harshdev Madhav
Tava Sparshe Sparshe (Poetry)
2006
[2]
Hema Naik
Bhogadandd (Novel)
2002
[2]
Henry Mendonca (H.M. Pernal)
Konkani Kavyem: Rupani Ani Rupakam (Essays)
2025
[2]
Herman Wouk
The Caine Mutiny
1951
[1]
Hernan Diaz
In the Distance
2018
[1]
Hernan Diaz
Trust
2023
[1]
Hilary Mantel
Wolf Hall
2009
[3]
Hilary Mantel
Bring Up the Bodies
2012
[3]
Himanshi Shelat
Andhari Galima Safed Tapakan (Short stories)
1996
[2]
Hirendra Nath Dutta
Manuh Anukule (Poetry)
2004
[2]
Hiro Shewkani
Sirjan Jo Sankat Ain Sindhi Kahani (Criticism)
2008
[2]
Hiro Thakur
Tahqiq Ain Tanqeed (Essays)
2003
[2]
Hiromi Kawakami
Under the Eye of the Big Bird
2025
[4]
Howard Jacobson
The Finkler Question
2010
[3]
Hrushikesh Mallick
Sarijaithiba Spera (Poetry)
2021
[2]
Hubert Mingarelli
Four Soldiers
2019
[4]
Hundraj Balwani
Purzo (Short Stories)
2024
[2]
Hussain-ul-Haque
Amawas Main Khwab (Novel)
2020
[2]
Hwang Sok-yong
At Dusk
2019
[4]
Hwang Sok-yong
Mater 2-10
2024
[4]
Ia Genberg
The Details
2024
[4]
Ia Genberg
Small Comfort
2026
[4]
Ian McEwan
Amsterdam
1998
[3]
Ibtisam Azem
The Book of Disappearance
2025
[4]
Ilyas Ahmad Gaddi
Fire Area (Novel)
1996
[2]
Imaiyam
Sellaatha Panam (Novel)
2020
[2]
Inderjeet Kesar
Bhagirath (Novel)
2018
[2]
Indira Goswami
For Assamese Literature
2000
[5]
Indra Vaswani
Miteea Khaan Miteea Taaeen (Short Stories)
2012
[2]
Iris Murdoch
The Sea, the Sea
1978
[3]
Irungbam Deven
Malangbana Kari Hai (Poetry)
2020
[2]
Ishwar Moorjani
Jeejal (Short Stories)
2019
[2]
Ismail Kadare
The Traitor’s Niche
2017
[4]
Ismail Kadare
A Dictator Calls
2024
[4]
Itamar Vieira Junior
Crooked Plow
2024
[4]
J. G. Farrell
The Siege of Krishnapur
1973
[3]
J. M. Coetzee
Life and Times of Michael K.
1983
[3]
J. M. Coetzee
Disgrace
1999
[3]
J.P. Marquand
The Late George Apley
1937
[1]
Jabir Husain
Ret Per Khema (Memoirs)
2005
[2]
Jadumani Besra
Bhabna (Poetry)
2005
[2]
Jagadguru Swami Rambhadracharyaji
For Sanskrit Literature
2023
[5]
Jagdish Prasad Mandal
Pangu (Novel)
2021
[2]
Jagtar
Jugnoo Deeva Te Darya (Poetry)
1995
[2]
Jamadar Kisku
Mala Mudam (Play)
2014
[2]
James A. Michener
Tales of the South Pacific
1947
[1]
James Agee
A Death in the Family
1957
[1]
James Alan McPherson
Elbow Room
1977
[1]
James Gould Cozzens
Guard of Honor
1948
[1]
James Kelman
How Late It Was, How Late
1994
[3]
Janardan Prasad Pandey 'Mani'
Deepmanikyam (Poetry)
2022
[2]
Jane Smiley
A Thousand Acres
1992
[1]
Janil Kumar Brahma
Dumphaoni Phitha (Short Stories)
2007
[2]
Ján Kalman Stefánsson
Fish Have No Feet
2017
[4]
Jas Yonjan 'Pyasi'
Shanti Sandeha (Poetry)
2004
[2]
Jaswant Deed
Kamandal (Poetry)
2007
[2]
Jaswant Singh Kanwal
Taushali Di Hanso (Novel)
1997
[2]
Jaswinder
Agarbatti (Poetry)
2014
[2]
Jaswinder Singh
Maat Lok (Novel)
2015
[2]
Jatindra Mohan Mohanty
Suryasnata (Criticism)
2003
[2]
Javed Akhtar
Lava (Poetry)
2013
[2]
Javier Cercas
The Impostor
2018
[4]
Jaya Prakash Pandya 'Jyotipunj'
Kankoo Kabandh (Play)
2000
[2]
Jayadar Kisku
Mala Mudam (Play)
2014
[2]
Jayamanta Mishra
Kavita Kusumanjali (Poetry)
1995
[2]
Jayant Kothari
Vank-dekham Vivechano (Criticism)
1998
[2]
Jayant Parmar
Pencil Aur Doosn Nazmein (Poetry)
2008
[2]
Jayant Pawar
Phoenixya Rakhetun Uthala Mor (Short Stories)
2012
[2]
Jayant Vishnu Narlikar
Chaar Nagarantale Maaze Viswa (Autobiography)
2014
[2]
Jayanta Madhab Bora
Moriahola (Novel)
2017
[2]
Jayanti Naik
Athang (Short Stories)
2004
[2]
Jayne Anne Phillips
Night Watch
2024
[1]
Jean Stafford
Collected Stories
1969
[1]
Jeet Thayil
These Errors Are Correct (Poetry)
2012
[2]
Jeeva Kant
Takait Achhi Chirai (Poetry)
1998
[2]
Jeffrey Eugenides
Middlesex
2003
[1]
Jennifer Egan
A Visit from the Goon Squad
2011
[1]
Jenny Erpenbeck
Go, Went, Gone
2018
[4]
Jenny Erpenbeck
Kairos
2024
[4]
Jente Posthuma
What I’d Rather Not Think About
2024
[4]
Jerry Pinto
Em and the big Hoom (Novel)
2016
[2]
Jess Fernandes
Kirvontt (Poetry)
2009
[2]
Jetho Lalwani
Jehad (Plays)
2020
[2]
Jhumpa Lahiri
Interpreter of Maladies
2000
[1]
Jinder
Safety Kit (Stories)
2025
[2]
Jitender Kumar Soni
Bharkhama (Stories)
2025
[2]
Jitendra Sharma
Buddh Suhagan (Plays)
1994
[2]
Jnan Pujari
Meghmalar Bhraman (Poetry)
2016
[2]
Joanna Scott
The Manikin
1997
[1]
Jodha C Sanasam
Mathou Kanba DNA (Novel)
2012
[2]
John Banville
The Sea
2005
[3]
John Baptist Sequeira
Ashim Asim Lharan (Poetry)
1998
[2]
John Berger
G.
1972
[3]
John Cheever
The Stories of John Cheever
1978
[1]
John Hersey
A Bell for Adano
1944
[1]
John Kennedy Toole
A Confederacy of Dunces
1981
[1]
John Steinbeck
The Grapes of Wrath
1939
[1]
John Updike
Rabbit Is Rich
1982
[1]
John Updike
Rabbit At Rest
1991
[1]
Jokha Alharthi
Celestial Bodies
2019
[4]
Jon Fosse
The Other Name: Septology I – II
2020
[4]
Jon Fosse
A New Name: Septology VI-VII
2022
[4]
Jonas Eika
After the Sun
2022
[4]
Jonathan Dee
The Privileges
2011
[1]
Jonathan Franzen
The Corrections
2002
[1]
Josephine Winslow Johnson
Now in November
1934
[1]
Joy Goswami
Pagli Tomar Sange (Poetry)
2000
[2]
Joy Williams
The Quick and the Dead
2001
[1]
Joyce Carol Oates
Black Water
1993
[1]
Joyce Carol Oates
What I Lived For
1995
[1]
Joyce Carol Oates
Blonde
2001
[1]
Joyce Carol Oates
Lovely, Dark, Deep
2015
[1]
Joysree Goswami Mahanta
Chanakya (Novel)
2019
[2]
Juan Gabriel Vásquez
The Shape of the Ruins
2019
[4]
Judhabir Rana
Loksahitya Ra Loksanskritiko Parichaya (Essays)
2023
[2]
Judith Schalansky
An Inventory of Losses
2021
[4]
Julia Peterkin
Scarlet Sister Mary
1928
[1]
Julian Barnes
The Sense of Ending / The Sense of an Ending
2001/2011
[3]
Junot Díaz
The Brief Wondrous Life of Oscar Wao
2008
[1]
K. B. Nepali
Saino (Drama)
2022
[2]
K. Jayakumar
Pingalakeshini (Poetry)
2024
[2]
K. P. Appan
Madhuram Ninte Jeevitham (Essays)
2008
[2]
K. P. Ramanunni
Daivathinte Pusthakam (Novel)
2017
[2]
K. R. Meera
Aarachar (Novel)
2015
[2]
K. Satchidanandan
Marannu Vecha Vasthukkal (Poetry)
2012
[2]
K. Shivaram Karanth
Mukajjiya Kanasugalu (Kannada)
1977
[5]
K. V. Narayana
Nudigala Alivu (Literary Criticism)
2024
[2]
K. V. Subbanna
Kaviraja Marga Mattu Kannada Jagattu (Essays)
2003
[2]
K. V. Tirumalesh
Akshaya Kavya (Poetry)
2015
[2]
Kabin Phukan
Ei Anuragi Ei Udasi (Poetry)
2011
[2]
Kailash Vajpeyi
Hawa Mein Hastakshar (Poetry)
2009
[2]
Kajli Soren (Jagannath Soren)
Sabarnaka Balire Sanan' Panjay (Poetry)
2022
[2]
Kala Nath Shastri
Akhyanavallari (Fiction)
2004
[2]
Kali Charan Hembram
Sisirjali (Short Stories)
2019
[2]
Kalipatnam Rama Rao
Yajnam To Tommidi (Short Stories)
1995
[2]
Kamal Ranga
Alekhun Amba (Play)
2022
[2]
Kamal Vora
Anekey (Poetry)
2016
[2]
Kamalkant Jha
Gachh Roosai Achhi (Short Stories)
2020
[2]
Kamleshwar
Kitne Pakistan (Novel)
2003
[2]
Kanhaiyalal Lekhwani
Sindhi Sahit Jo Mukhtasar Itihas (Literary History)
2022
[2]
Karen Russell
Swamplandia!
2012
[1]
Karidnan Barhath
Mati Ri Mahak (Short Stories)
1994
[2]
Kashinath Mishra
Harsacarita-Manjari (Poetry)
2002
[2]
Kashinath Shamba Lolienkar (S.D.Tendulkar)
Kavyasutra (Poetry)
2012
[2]
Kashinath Singh
Rehan Par Raghu (Novel)
2011
[2]
Katherine Anne Porter
The Collected Stories
1965
[1]
Katindra Swargiary
Sanmwkhangari Lamajwng (Novel)
2006
[2]
Katyayani Vidmahe
Sahityaakashmlo Sagam (Essays)
2013
[2]
Kazuo Ishiguro
The Remains of the Day
1989
[3]
Kedar Nath Singh
For Hindi Literature
2013
[5]
Keerti Narayan Mishra
Dhwast Hoet Shanti Stoop (Poetry)
1997
[2]
Keisham Priyokumar
Nongdi Tarak-Khidre (Short stories)
1998
[2]
Kelly Link
Get in Trouble: Stories
2016
[1]
Kenzaburo
Death by Water
2016
[4]
Keri Hulme
The Bone People
1985
[3]
Keshab Chandra Dash
Isha (Poetry)
1996
[2]
Keshada Mahanta
Asomiya Ramayani Sahitya: Kathabostur Atiguri (Criticism)
2010
[2]
Ketu Viswanatha Reddy
Kethu Vishwanatha Reddy Kathalu (Short Stories)
1996
[2]
Khajur Singh Thakur
Thakur Satsayie (Poetry, Couplets)
2025
[2]
Khaleel Mamoon
Aafaaq Ki Taraf (Poetry)
2011
[2]
Khalid Hussain
Sullan Da Salan (short stories)
2021
[2]
Kherwal Saren
Chet Re Cikayena (Play)
2007
[2]
Khiman U Mulani
Jia Mein Taandaa (Poetry)
2018
[2]
Kingsley Amis
The Old Devils
1986
[3]
Kiran Desai
The Inheritance of Loss
2006
[3]
Kiran Gurav
Baluchya Awasthantarachi Diary (Short Stories)
2021
[2]
Kiran Nagarkar
Cuckold (Novel)
2000
[2]
Kirpal Kazak
Antheen (Short Stories)
2019
[2]
Kirat Babani
Dharti-A-Jo-Sad (Plays)
2006
[2]
Kirtinath Kurtkoti
Uriya Nalage (Criticism)
1995
[2]
Kishore Kalpanakant
Kookh Padyai Ree Peed (Poetry)
1995
[2]
Koijam Shantibala
Leironnung (Poetry)
2022
[2]
Kolakaluri Enoch
Vimarshini (Essays)
2018
[2]
Kovilan (V.V. Ayyappan)
Thattakam (Novel)
1998
[2]
Krishan Sharma
Dhaldi Dhuppe Da Sek (Short Stories)
2005
[2]
Krishna Kumar Toor
Ghurfa-i-Ghaib (Poetry)
2012
[2]
Krishna Singh Moktan
Jeevan Goretoma (Novel)
2005
[2]
Krushnat Khot
Ringan (Novel)
2023
[2]
Kshetri Bira
Nangbu Ngaibada (Novel)
2011
[2]
Kshetri Rajen
Ahingna Yakshilliba Mang (Poetry)
2015
[2]
Kula Saikia
Akashar Chhabi Aru Anyanya Galpa (Short Stories)
2015
[2]
Kum. Veerabhadrappa
Aramane (Novel)
2007
[2]
Kumar Manish Arvind
Jingik Oriaon Karait (Poetry)
2019
[2]
Kundan Mali
Aalochana Ree Aankh Sun (Criticism)
2007
[2]
Kunwar Narayan
For Hindi Literature
2005
[5]
Kunwar Narain
Koi Doosra Nahin (Poetry)
1995
[2]
Kuppali Venkatappagowda Puttappa
Ramayan (Kannada)
1967
[5]
L. Birmangol Singh (Beryl Thanga)
Ei Amadi Adungeigi Eethat (Novel)
2019
[2]
L. S. Seshagiri Rao
English Sahitya Charitre (Literary history)
2001
[2]
Laila Lalami
The Moor's Account
2015
[1]
Laitonjam Premchand Singh
Eemagi Phanek Machet (Short stories)
2000
[2]
Lakhi Devi Sundas
Aahat Anubhuti (Short stories)
2001
[2]
Lakshman Srimal
Curfew (Play)
2007
[2]
Lakshmisha Tolpadi
Mahabharatha Anusandhanada Bharathayatre (Essays)
2023
[2]
Lalit Magotra
Cheten Diyan Galiyan (Essays)
2011
[2]
Larry McMurtry
Lonesome Dove
1986
[1]
László Krasznahorkai
The World Goes On
2018
[4]
Laurent Binet
The 7th Function of Language
2018
[4]
Laurent Mauvignier
The Birthday Party
2023
[4]
Laxman Dubey
Ajan Yaad Aahe (Poetry)
2010
[2]
Laxmi Narayan Ranga
Poornamidam (Plays)
2006
[2]
Lee Martin
The Bright Forever
2006
[1]
Leeladhar Jagoori
Anubhav Ke Aakash Mein Chand (Poetry)
1997
[2]
Linda Hogan
Mean Spirit
1991
[1]
Lok Nath Upadhyay Chapagain
Kina Royeu Upamaa (Short Stories)
2018
[2]
Lore Segal
Shakespeare's Kitchen
2008
[1]
Louis Bromfield
Early Autumn
1926
[1]
Louise Erdrich
The Plague of Doves
2009
[1]
Louise Erdrich
The Night Watchman
2021
[1]
Lucas Rijneveld
The Discomfort of Evening
2020
[4]
Lydia Millet
Love in Infant Monkeys
2010
[1]
M. Borkanya
Leikangla (Novel)
2010
[2]
M. Chidananda Murthy
Hosatu Hosatu (Criticism)
1997
[2]
M. Farooq Nazki
Naar Hatun Kazal Wanas (Poetry)
1995
[2]
M. Gopi
Kalanni Nidra Ponivvanu (Poetry)
2000
[2]
M. K. Sanu
Basheer: Ekantha Veedhiyile Avadhoothan (Biography)
2011
[2]
M. M. Kalburgi
Marga-4 (Essays)
2006
[2]
M. N. Paloor
Kathayillathavante Kathakal (Autobiography)
2013
[2]
M. P. Veerendra Kumar
Haimavathabhuvil (Travelogue)
2010
[2]
M. Rajendran
Kaala Paani (Novel)
2022
[2]
M. Sukumaran
Chuvanna Chinnangal (Short Stories)
2006
[2]
M. T. Vasudevan Nair
Randamoozham (Bengali)
1995
[5]
M. Thomas Mathew
Ashaante Seethayanam (Literary Criticism)
2022
[2]
M. Veerappa Moily
Sri Bahubali Ahimsadigvijayam (Epic Poetry)
2020
[2]
MacKinlay Kantor
Andersonville
1955
[1]
Madhav Borcar
Yaman (Poetry)
2001
[2]
Madhavi Sardesai
Manthan (Essays)
2014
[2]
Madhu Acharya 'Ashawadi'
Gawaad (Novel)
2015
[2]
Madhukar Vasudev Dhond
Dnyaneshwaritil Laukik Srishti (Criticism)
1997
[2]
Madhuranthakam Narendra
Manodharmaparagam (Novel)
2022
[2]
Mahadevi Varma
Yama (Hindi)
1982
[5]
Mahamahopadhyaya Sadhu Bhadreshdas
Prasthanacatustaye Brahmagosah (Poetry)
2025
[2]
Mahan Bhandari
Moon Di Akh (Short stories)
1998
[2]
Mahasweta Devi
For Bengali Literature
1996
[5]
Mahendra
Dhatri Paat San Gaam (Memoir)
2025
[2]
Mahendra Malangia
Prabandh Sangrah (Essays)
2024
[2]
Mahesh Chandra Sharma Gautam
Vaishali (Novel)
2020
[2]
Mahesh Dattani
Final Solutions and other Plays (Plays)
1998
[2]
Mahesh Elkunchwar
Yugant (Play)
2002
[2]
Maheswar Soren
Seched Sawnta Ren Andha Manmi (Play)
2024
[2]
Mahim Bora
Edhani Mahir Hanhi (Novel)
2001
[2]
Makhonmani Mongsaba
Matamgi Kanba DNA (Novel)
2013
[2]
Makmoor Saeedi
Rasta Aur Main (Poetry)
2006
[2]
Malathi Rao
Disorderly Women (Novel)
2007
[2]
Malchand Tiwari
Utaryo Hal Abho (Poetry)
1997
[2]
Mamang Dai
The Black Hill (Novel)
2017
[2]
Mamta Kalia
Jeete Jee Allahabad (Memoir)
2025
[2]
Man Bahadur Pradhan
Manka Lahar Ra Raharharu (Travelogue)
2013
[2]
Man Mohan Jha
Ganga-Putra (Short Stories)
2009
[2]
Man Mohan Jha
Khissa (Short Stories)
2015
[2]
Man Prasad Subba
Adim Busty (Poetry)
1998
[2]
Manglesh Dabral
Hum Jo Dekhte Hain (Poetry)
2000
[2]
Mangalshingh Hazowary
Jiuni Mwgthang Bisombi Arw Aroj (Poetry)
2005
[2]
Mani Prasad Rai
Veer Jatiko Amar Kahani (Biographical Essays)
1997
[2]
Manindra Gupta
Bane Aaj Concherto (Poetry)
2011
[2]
Manmohan
Nirvaan (Novel)
2013
[2]
Manohar Shyam Joshi
Kyaap (Novel)
2005
[2]
Manoranjan Lahar
Dainee? (Novel)
2009
[2]
Manshoor Banihali
Yeth Waweh Halay Tsong Kous Zalay (Poetry)
2023
[2]
Mantreshwar Jha
Katek Daaripar (Memoirs)
2008
[2]
Margaret Atwood
Girl, Woman, Other / The Testaments
2019
[3]
Margaret Atwood
The Blind Assassin
2000
[3]
Margaret Ayer Barnes
Years of Grace
1930
[1]
Margaret Mitchell
Gone with the Wind
1936
[1]
Margaret Verble
Maud's Line
2016
[1]
Margaret Wilson
The Able McLaughlins
1923
[1]
Maria Stepanova
In Memory of Memory
2021
[4]
Mariana Enríquez
The Dangers of Smoking in Bed
2021
[4]
Marianne Wiggins
Evidence of Things Unseen
2004
[1]
Marie NDiaye
Ladivine
2016
[4]
Marie NDiaye
The Witch
2026
[4]
Marilynne Robinson
Housekeeping
1982
[1]
Marilynne Robinson
Gilead
2005
[1]
Marion Poschmann
The Pine Islands
2019
[4]
Marjorie Kinnan Rawlings
The Yearling
1938
[1]
Marlon James
A Brief History of Seven Killings
2015
[3]
Martin Flavin
Journey in the Dark
1943
[1]
Maryse Condé
The Gospel According to the New World
2023
[4]
Masia Di Raat
Play
2016
[2]
Masti Venkatesh Iyengar
Chikaveer Rajendra (Kannada)
1983
[5]
Mathias Énard
Compass
2017
[4]
Mathias Énard
The Deserters
2026
[4]
Matteo Melchiorre
The Duke
2026
[4]
Maya Anil Kharangate
Amrutvel (Novel)
2022
[2]
Maya Rahi
Mahengi Murk (Short Stories)
2015
[2]
Maylis de Kerangal
Mend the Living
2016
[4]
Mazen Maarouf
Jokes for the Gunmen
2019
[4]
Mazhar Imam
Pichhle Mausam Ka Phool (Poetry)
1994
[2]
Medini Choudhury
Biponna Samay (Novel)
1999
[2]
Meenakshi Mukherjee
The Perishable Empire : Essays On Indian Writing in English (Essays)
2003
[2]
Meethesh Nirmohi
Mugtee (Poetry)
2021
[2]
Melvyn Rodrigues
Prakriticho Paas (Poetry)
2011
[2]
Michael Chabon
The Amazing Adventures of Kavalier & Clay
2001
[1]
Michael Cunningham
The Hours
1999
[1]
Michael Houellebecq
Serotonin
2020
[4]
Michael Ondaatje
The English Patient
1992
[3]
Michael Shaara
The Killer Angels
1974
[1]
Mieko Kawakami
Heaven
2022
[4]
Mircea Cărtărescu
Solenoid
2025
[4]
Mishal Sultanpuri
Vont (Literary Criticism)
2009
[2]
Mithila Prasad Tripathi
Bharqviyam (Poetry)
2010
[2]
Mitter Sain Meet
Sudhar Ghar (Novel)
2008
[2]
Mohammand Yousuf Taing
Mahjoor Shinasi (Criticism)
1998
[2]
Mohan Geham
...Ta Khawaban Jo Chha Thindo (Plays)
2011
[2]
Mohan Parmar
Anchaio (Short Stories)
2011
[2]
MohanThakuri
Nihsabda (Poetry)
1996
[2]
Mohanjit
Kone Da Suraj (Poetry)
2018
[2]
Mohi-ud-Din Reshi
Aina Aatash (Short Stories)
2013
[2]
Mohiud-Din-Gowhar
Rikhah (Poetry)
2001
[2]
Moirangthem Rajen
Cheptharaba Eshingpun (Short Stories)
2016
[2]
Mridula Garg
Miljul Man (Novel)
2013
[2]
Mrs. Krishna Sobti
For Hindi Literature
2017
[5]
Mudnakudu Chinnaswamy
Bahutvada Bhaarata mattu Bouddha Taatvikate (Collection of Articles)
2022
[2]
Mukesh Thali
Rangtarang (Essays)
2024
[2]
Mukut Maniraj
Gaon Ar Amma (Poetry)
2024
[2]
Munawwar Rana
Shahdaba (Poetry)
2014
[2]
Munipalle B. Raju
Astivandanam Aavali Teerana (Short Stories)
2006
[2]
Mushtaq Ahmad Mushtaq
Aakh (Short Stories)
2018
[2]
Mwdai Gahai
Khora Sayao Arw Himalay (Poetry)
2021
[2]
N. Gopi
Kalanni Nidra Ponivvanu (Poetry)
2000
[2]
N. Prabhakaran
Maayaamanushyar (Novel)
2025
[2]
N. Scott Momaday
House Made of Dawn
1968
[1]
Nabaneeta Dev Sen
Naba-Nita (Prose-Poetry)
1999
[2]
Nachhattar
Slow Down (Novel)
2017
[2]
Nadie Gordimer
The Conservationist
1974
[3]
Nagen Saikia
Andharat Nijar Mukh (Short stories)
1997
[2]
Nagendramani Pradhan
Dr. Parasmani Ko Jiwan Yatra (Biography)
1995
[2]
Naiyer Masud
Taoos Chaman Ki Maina (Short Stories)
2001
[2]
Naji Munawar
Pursaan (Criticism)
2002
[2]
Nalinidhar Bhattacharyya
Mahat Oitiyya (Criticism)
2002
[2]
Namdeo Dhondo Mahanor
Panzad (Poetry)
2000
[2]
Namdeo Kamble
Raghavavel (Novel)
1995
[2]
Namdev Tarachandani
Mansh-Nagari (Poetry)
2013
[2]
Namita Gokhale
Things to Leave Behind (Novel)
2021
[2]
Nana Ekvtimishvili
The Pear Field
2021
[4]
Nanda Hankhim
Satta Grahan (Short Stories)
2014
[2]
Nanda Khare
Udya (Novel)
2020
[2]
Nandeswar Daimari
Jiu-Safarni Dakhwn (Short Stories)
2023
[2]
Nanjil Nadan
Soodiya Poo Soodarka (Short Stories)
2010
[2]
Naorem Bidyasagar Singh
Khung-Gang Amasung Refugee (Poetry)
2014
[2]
Naresh Mehta
For Hindi Literature
1992
[5]
Naseem Shafaie
Na Thsay Na Aks (Poetry)
2011
[2]
Nasira Sharma
Paarijat (Novel)
2016
[2]
Nathan Englander
What We Talk About When We Talk About Anne Frank
2013
[1]
Naveen
Kalarekhalu (Novel)
2004
[2]
Navtej Sarna
Crimson Spring (Novel)
2025
[2]
Neelum Saran Gour
Requiem in Raga Janki (Novel)
2023
[2]
Neeraj Daiya
Bina Hasal Pai (Criticism)
2017
[2]
Nem Narayan Joshi
Olun Ri Akhiyatan (Memoirs)
1996
[2]
Ngũgĩ wa Thiong’o
The Perfect Nine
2021
[4]
Nida Fazli
Khoya Hua Sa Kuchh (Poetry)
1998
[2]
Nikhileswar
Agniswaasa (2015-2017) (Poetry)
2020
[2]
Nilba A. Khandekar
The Words (Poetry)
2019
[2]
Nilmani Phookan
For Assamese Literature
2021
[5]
Ningombam Sunita
Khongji Makhol (Short stories)
2001
[2]
Niraja Renu (Khamakhy A Devi)
Ritambhara (Short Stories)
2003
[2]
Niranjan Hansda
Mane Rena Arhang (Short Stories)
2021
[2]
Niranjan Mishra
Gangaputravadanam (Poetry)
2017
[2]
Niranjan N. Bhagat
Gujarati Sahitya-Purvardha Uttarardha (Criticism)
1999
[2]
Niranjan Singh Tasneem
Gawache Arth (Novel)
1999
[2]
Nirmal Verma
Essays Bharat Aur Europe: pratishruti ke kshetra
1999
[5]
Nirupama Borgohain
Abhijatri (Novel)
1996
[2]
Nizam Siddiqui
Mabad-e-Jadidiat Se Naye Ahed Ki Takhliqiyat Tak (Criticism)
2016
[2]
Norman Erikson Pasaribu
Happy Stories, Mostly
2022
[4]
Norman Mailer
The Executioner's Song
1980
[1]
Norman Rush
Whites
1987
[1]
Nrisinghaprasad Bhaduri
Mahabharater Astadashi (Essays)
2016
[2]
Olga Ravn
The Employees
2021
[4]
Olga Ravn
The Wax Child
2026
[4]
Olga Tokarczuk
Flights
2018
[4]
Olga Tokarczuk
Drive Your Plow Over the Bones of the Dead
2019
[4]
Olga Tokarczuk
The Books of Jacob
2022
[4]
Oliver La Farge
Laughing Boy
1929
[1]
Om Sharma Jandriari
Bandralta Darpan (Essays)
2019
[2]
Om Vidyarthi
Trip Trip Chete (Travelogue)
2002
[2]
Omchery N.N Pillai
Akasmikam (Omcheriyute Ormmakkurippukal) (Memoirs)
2020
[2]
Orhan Pamuk
A Strangeness in My Mind
2016
[4]
Oscar Hijuelos
The Mambo Kings Play Songs of Love
1990
[1]
Oscar Hijuelos
Mr. Ives' Christmas
1996
[1]
P. H. Newby
Something to Answer For
1969
[3]
P. Sri. Ramachandrudu
Ko Vai Rasah (Essays)
2001
[2]
P. V. Akilandam
Chittirappavai (Tamil)
1975
[5]
Pandurang Bhangui
Champhell'li Sanj (Poetry)
2000
[2]
Pannalal Patel
Manvini Bhavai (Gujarati)
1985
[5]
Papineni Sivasankar
Rajanigandha (Poetry)
2016
[2]
Paresh Narendra Kamat
Chitralipi (Poetry)
2018
[2]
Pat Barker
The Ghost Road
1995
[3]
Pathani Pattnaik
Jibanara Chalapathe (Autobiography)
2010
[2]
Paul Beatty
The Sellout
2016
[3]
Paul Harding
Tinkers
2010
[1]
Paul Kaur
Sun Gunvanta Sun Budhivanta : Itihaasnama Punjab (Poetry)
2024
[2]
Paul Scott
Staying On
1977
[3]
Paulo Scott
Phenotypes
2022
[4]
Pearl S. Buck
The Good Earth
1931
[1]
Peddibhotla Subbaramaiah
Peddibhotla Subbaramaiah Kathalu - Vol-1 (Short Stories)
2012
[2]
Penna Madhusudan
Prajnachakshusham (Poetry)
2019
[2]
Penelope Fitzgerald
Offshore
1979
[3]
Penelope Lively
Moon Tiger
1987
[3]
Penugonda Lakshminarayana
Deepika (Criticism)
2024
[2]
Percival Everett
Telephone
2021
[1]
Percival Everett
James
2025
[1]
Perumal Murugan
Pyre
2023
[4]
Peter Carey
Oscar and Lucinda
1988
[3]
Peter Taylor
A Summons to Memphis
1987
[1]
Phani Mohanty
Mruguaya (Poetry)
2009
[2]
Philip Roth
The Ghost Writer
1980
[1]
Philip Roth
Operation Shylock: A Confession
1994
[1]
Philip Roth
Sabbath's Theater
1996
[1]
Philip Roth
American Pastoral
1998
[1]
Philipp Meyer
The Son
2014
[1]
Phukan Ch. Basumatary
Akhai Athumniphrai (Poetry)
2019
[2]
Poomani
Agn-gnaadi (Novel)
2014
[2]
Pradip Bihari
Sarokar (Short Stories)
2007
[2]
Praduman Singh Jindraha
Geet Sarovar (Poetry)
2009
[2]
Prafulla Kumar Mohanty
Bharatiya Sanskriti O Bhagwadgita (Essays)
2004
[2]
Prafulla Roy
Krantikal (Novel)
2003
[2]
Prakash Bhattarai
Nepali Paramparik Sanskriti Ra Sabhyata Ko Dukuti (Essays)
2025
[2]
Prakash S. Parienkar
Varsal (Short Stories)
2023
[2]
Pramod Kumar Mohanty
Asaranti Anasara (Poetry)
2008
[2]
Pratibha Ray
Yajnaseni (Odia)
2011
[5]
Pratibha Ray
Ullanghan (Short stories)
2000
[2]
Pratibha Satpathy
Tanmaya Dhuli (Poetry)
2001
[2]
Praveen Dashrath Bandekar
Ujavya Sondechya Bahulya (Novel)
2022
[2]
Premananda Mosahari
Okhafwni Dwima (Poetry)
2011
[2]
Pritpal Singh Betab
Safar Jaari Hai (Poetry)
2025
[2]
Prof.Raghupati Sahay ‐ Firaq Gorakhpuri
Gule-e-Naghma (Urdu)
1969
[5]
Purabi Bormudoi
Santanukulanandan (Novel)
2007
[2]
Puviyarasu
Kaiyoppam (Poetry)
2009
[2]
Qurratulain Hyder
Aakhir-e-Shab Ke Hamsafar (Travellers Unto the Night)
1989
[5]
R. N. Joe D' Cruz
Korkai (Novel)
2013
[2]
R. Ramachandran
R. Ramachandrante Kavitakal (Poetry)
2000
[2]
R. Vairamuthu
For Tamil Literature / Kallikattu Ithikasam (Novel)
2025/2003
[5]/[2]
Rabilal Tudu
Parsi Khatir (Play)
2015
[2]
Rachapalem Chandrashekara Reddy
Mana Navalalu-Mana Kathanikalu (Literary Criticism)
2014
[2]
Radhakant Thakur
Chaladuravani (Poetry)
2013
[2]
Radhavallabh Tripathi
Sandhanam (Poetry)
1994
[2]
Raduan Nassar
A Cup of Rage
2016
[4]
Rafiq Raaz
Nai Che Nallan (Poetry)
1997
[2]
Raghu Leishangthem
Khungangi Chithi (Poetry)
2009
[2]
Raghavendra Patil
Teru (Novel)
2005
[2]
Rahamath Tarikere
Kattiyachina Daari (Criticism)
2010
[2]
Rahman Abbas
Rohzin (Novel)
2018
[2]
Raj Rahi
Namme Tunnel (Short Stories)
2021
[2]
Rajan Gavas
Tanakat (Novel)
2001
[2]
Rajendra Keshavlal Shah
For Gujarati Literature
2001
[5]
Rajendra Shukla
Gazal-Samhita (Poetry)
2007
[2]
Rajen Toijamba
Chahee Taret Khuntakpa (Play)
2017
[2]
Rajesh Joshi
Do Panktiyon Ke Beech (Poetry)
2002
[2]
Rajesh Kumar Vyas
Kavita Deeth (Poetry)
2018
[2]
Rajkumar Bhubonsana
Mei Mamgera Budhi Mamgera (Poems)
2002
[2]
Rajkumar Mani Singh
Mayai Karaba Shamu (Short stories)
1994
[2]
Rajmohan Gandhi
Rajaji: A Life (Biography)
2001
[2]
Rama Kant Shukla
Mama Janani (Poetry)
2018
[2]
Ramachandra Behera
Gopapura (Short Stories)
2005
[2]
Ramachandra Guha
India After Gandhi (Narrative History)
2011
[2]
Ram Chandra Murmu
Guru Gomke Pondet Raghunath Murmu (Biography)
2006
[2]
Ramdarash Mishra
Aag Ki Hansi (Poetry)
2015
[2]
Ramdhari Singh (Dinkar)
Urvashi (Hindi)
1972
[5]
Ramesh Chandra Shah
Vinayak (Novel)
2014
[2]
Ramesh Kuntal Megh
Vishw Mithak Sarit Sagar (Literary Criticism)
2017
[2]
Ramesh Parekh
Vitan Sud Beej (Poetry)
1994
[2]
Ramji Thakur
Laghupadhyaprabandhatrayi (Poetry)
2012
[2]
Ramlal Adhikari
Nisansmaran (Essays)
2000
[2]
Ramswaroop Kisan
Bareek Baat (Short Stories)
2019
[2]
Ranganath Pathare
Tamrapat (Novel)
1999
[2]
Rasik Shah
Antey Aarambh (Part-I & II)(Essays)
2015
[2]
Ratilal 'Anil'
Aatano Suraj (Essays)
2006
[2]
Ratilal Borisagar
Mojma Revu Re (Essays)
2019
[2]
Ratan lal Shant
Tshen (Short Stories)
2007
[2]
Ravauri Bharadwaja
Pakudu Rallu(Telugu)
2012
[5]
Ravindra Kelekar
Ami Taankan Manshant Haadle
2006
[5]
Raymond Carver
Cathedral
1984
[1]
Raymond Carver
Where I'm Calling From
1989
[1]
Rebecca Makkai
The Great Believers
2019
[1]
Rehman Rahi
Siyah Rood Jaeren Manz( In Black Drizzle ).
2004
[5]
Rene Karabash
She Who Remains
2026
[4]
Reynolds Price
The Collected Stories
1994
[1]
Richard Flanagan
The Narrow Road to the Deep North
2014
[3]
Richard Ford
Independence Day
1996
[1]
Richard Ford
Let Me Be Frank With You
2015
[1]
Richard Powers
The Echo Maker
2007
[1]
Richard Powers
The Overstory
2019
[1]
Richard Russo
Empire Falls
2002
[1]
Rita Bullwinkel
Headshot: A Novel
2025
[1]
Rita Choudhury
Deou Langkhui (Novel)
2008
[2]
Robert Faulkner
A Fable / The Reivers
1954/1962
[1]
Robert Lewis Taylor
The Travels of Jaimie McPheeters
1958
[1]
Robert Olen Butler
A Good Scent from a Strange Mountain
1993
[1]
Robert Penn Warren
All the King's Men
1946
[1]
Robert Seethaler
A Whole Life
2016
[4]
Robert Stone
A Flag for Sunrise
1982
[1]
Robert Stone
Bear and His Daughter: Stories
1998
[1]
Roddy Doyle
Paddy Clarke ha-ha-ha
1993
[3]
Rodrigo Blanco Calderón
Simpatía
2024
[4]
Roy Jacobsen
The Unseen
2017
[4]
Rupa Bajwa
The Sari Shop (Novel)
2006
[2]
Russell Banks
Continental Drift
1986
[1]
Russell Banks
Cloudsplitter
1999
[1]
Ruth Prawer Jhabvala
Heat and Dust
1975
[3]
S. K. Pottekat
Oru- Dishatinte – Katha (Malayalam)
1980
[5]
S. Ramakrishnan
Sancharam (Novel)
2018
[2]
S. Ramesan Nair
Gurupournami (Poetry)
2018
[2]
S. Srinivasa Sarma
Jagadguru Sri Chandrasekharendra Saraswati Vijayam (Poetry)
2000
[2]
S. Venkatesan
Kaval Kottam (Novel)
2011
[2]
Sachida Nanda Routray
For Odia Literature
1986
[5]
Sadanand Deshmukh
Baromas (Novel)
2004
[2]
Sadanand Shridhar More
Tukaram Darshan (Criticism)
1998
[2]
Sadiqua Nawab Saher
Rajdev Ki Amrai (Novel)
2023
[2]
Sagolsem Lanchenba Meetei
Hi Nangbu Hondeda (Poetry)
1999
[2]
Salam Bin Razzak
Shikasta Buton Ke Darmiyan (Short Stories)
2004
[2]
Salman Rushdie
Midnight's Children
1981
[3]
Salon Karthak
Biswa Euta Pallo Gaon (Travelogue)
2019
[2]
Samanta Schweblin
Fever Dream
2017
[4]
Samanta Schweblin
Mouthful of Birds
2019
[4]
Samanta Schweblin
Little Eyes
2020
[4]
Samarendra Sengupta
Amar Samay Alpa (Poetry)
2007
[2]
Samira Chhetri 'Priyadarshi'
Gairi Gaon Ki Chameli (Short Stories)
2009
[2]
Sandipan Chattopadhyay
Ami O Banabehari (Novel)
2002
[2]
Sang Young Park
Love in the Big City
2022
[4]
Sanjeev
Mujhe Pahachaano (Novel)
2023
[2]
Sanjiv Verenkar
Raktachandan (Poetry)
2021
[2]
Santosh Mayamohan
Simaran (Poetry)
2003
[2]
Santosh Singh Dhir
Pakhi (Short stories)
1996
[2]
Saou Ichikawa
Hunchback
2025
[4]
Sara Joseph
Alahayude Penmakkal (Novel)
2003
[2]
Sara Stridsberg
The Faculty of Dreams
2019
[4]
Sarat Kumar Mukhopadhyay
Ghumer Barir Mato Chand (Poetry)
2008
[2]
Saratchand Thiyam
Nungshibi Greece (Travelogue)
2006
[2]
Satish Kalasekar
Vachanyachi Rajanishee (Essays)
2013
[2]
Satish Rohra
Kavita Khan Kavita Tain (Criticism)
2004
[2]
Satya Vrat Shastri
For Sanskrit Literature
2006
[5]
Satyanarayan Rajaguru
Mo Jeevana Sangrama (Autobiography)
1996
[2]
Saul Bellow
Humboldt's Gift
1975
[1]
Selva Almada
Not a River
2024
[4]
Sethu (A. Sethumadhavan)
Adayalangal (Novel)
2007
[2]
Shad Ramzan
Kore Kakud Pushrith Gome (Poetry)
2014
[2]
Shafey Kidwai
Sawaneh-E-Sir Syed: Ek Bazdeed (Biography)
2019
[2]
Shafi Shauq
Yaad Aasmqan Hinz (Poetry)
2006
[2]
Shahrnush Parsipur
Women Without Men
2026
[4]
Shailender Singh
Hashiye Par (Novel)
2014
[2]
Shamim Tariq
Tasawwuf aur Bhakti (Tanqeedi Aur Taqabuli Mutalea) (Criticism)
2015
[2]
Shanka Ghosh
For Bengali Literature
2016
[5]
Shankar Dev Dhakal
Kirayako Kokh (Novel)
2020
[2]
Shanti Bhardwaj 'Rakesh'
Ud Ja Re Sua (Novel)
1998
[2]
Shantinath K. Desai
Om Namo (Novel)
2000
[2]
Shashi Tharoor
An era of Darkness (Non-Fiction)
2019
[2]
Sheen Kaaf Nizam
Gumshuda Dair Ki Gunjati Ghantiyan (Poetry)
2010
[2]
Shefalika Verma
Kist-Kist Jeewan (Autobiography)
2012
[2]
Shida Bazyar
The Nights Are Quiet in Tehran
2026
[4]
Shirley Ann Grau
The Keepers of the House
1964
[1]
Shiv Nath
Cheten Di Chitabri (Essays)
2004
[2]
Shokoofeh Azar
The Enlightenment of The Greengage Tree
2020
[4]
Shri Gulzar(lyricist)
For Urdu Literature
2023
[5]
Shri lal Shukla
For Hindi Literature
2009
[5]
Shriniwas Rath
Tadeva Gaganam Saivadhara (Poetry)
1999
[2]
Shyam Besra 'Jiwi Rarec'
Marom (Novel)
2018
[2]
Shyam Darihare
Barki Kaki at Hotmail Dot Com (Short Stories)
2016
[2]
Shyam Dev Parashar
Triveni (Poetry)
1997
[2]
Shyam Manohar
Utsukatene Mee Zopalo (Novel)
2008
[2]
Sinclair Lewis
Arrowsmith
1925
[1]
Sitakant Mahapatra
For Odia Literature
1993
[5]
Sitaram Sapolia
Doha Satsai (Poetry)
2013
[2]
Solvej Balle
On the Calculation of Volume I
2025
[4]
Somdev
Sahasmukhi Chowk Par (Poems)
2002
[2]
Stefan Hertmans
War and Turpentine
2017
[4]
Steven Millhauser
Martin Dressler: The Tale of an American Dreamer
1997
[1]
Subhash Chandran
Manushyanu Oru Aamukham (Novel)
2014
[2]
Subhas Mukhopadhyay
For Bengali Literature
1991
[5]
Subrata Mukhopadhyaya
Birasan (Novel)
2012
[2]
Sudhir Naoroibam
Leiyee Khara Punsi Khara (Short stories)
2003
[2]
Sumitra Soren
Mid Birna Chenne Saon Inag Sagai (Short Stories)
2025
[2]
Sunetra Gupta
Memories of Rain (Novel)
1996
[2]
Susan Choi
American Woman
2004
[1]
Sutinder Singh Noor
Kavita Di Bhumika (Criticism)
2004
[2]
T. Padmanabhan
Gowri (Short stories)
1996
[2]
T. S. Stribling
The Store
1932
[1]
T.Shiva Shankara Pillai
Kayar (Malayalam)
1984
[5]
Tamilanban
Vanakkam Valluva (Poetry)
2004
[2]
Taraceen Baskey (Turia Chand Baskey)
Jaba Baha (Short Stories)
2023
[2]
Tarashankar Bandyopadhyay
Ganadevata (Bengali)
1966
[5]
Tarun Kanti Mishra
Bhaswati (Short Stories)
2019
[2]
Temsula Ao
Laburnum For My Head (Short Stories)
2013
[2]
Thomas Berger
The Feud
1984
[1]
Thomas Keneally
Schindler's List
1982
[3]
Thornton Wilder
The Bridge of San Luis Rey
1927
[1]
Tim O'Brien
The Things They Carried
1991
[1]
Tommy Orange
There There
2019
[1]
Tommy Wieringa
The Death of Murat Idrissi
2019
[4]
Toni Morrison
Beloved
1988
[1]
U. A. Khader
Thrikkotlur Novellakal (Novellas)
2009
[2]
U. R. Ananthamurthy
For Kannada Literature
1994
[5]
Uday Chandra Jha 'Vinod'
Apaksha (Poetry)
2011
[2]
Uday Prakash
Mohan Das (Short Story)
2010
[2]
Umashankar Joshi
Darshanam Nisheeth (Gujarati)
1967
[5]
Upamanyu Chatterjee
The Mammaries of The Welfare State (Novel)
2004
[2]
Upton Sinclair
Dragon's Teeth
1942
[1]
Urszula Honek
White Nights
2024
[4]
Utpal Kumar Basu
Piya Mana Bhabe (Poetry)
2014
[2]
V. S. Naipaul
In a Free State
1971
[3]
Vaidehi
Krouncha Pakshigalu (Short Stories)
2009
[2]
Vallampati Venkata Subbaiah
Katha Silpam (Essays)
1999
[2]
Vanita
kaal Pehar Ghaarian (Poetry)
2010
[2]
Vauhini Vara
The Immortal King Rao
2023
[1]
Veena Gupta
Chhe Roopak (Drama)
2022
[2]
Veronica Raimo
Lost on Me
2024
[4]
Viet Thanh Nguyen
The Sympathizer
2016
[1]
Vigdis Hjorth
Is Mother Dead
2023
[4]
Vijaya
Kudi Esaru (Autobiography)
2019
[2]
Vincent Delecroix
Small Boat
2025
[4]
Vinayaka Krishna Gokak
Bharatha Sindhu Rashmi
1990
[5]
Vinda Karandikar
Ashtadarshan(Marathi)
2003
[5]
Vinod Kumar Shukla
For Hindi Literature / Deewar Mein Ek Khirkee Rahathi Thi (Novel)
2024/1999
[5]/[2]
Violaine Huisman
The Book of Mother
2022
[4]
Virginie Despentes
Vernon Subutex 1
2018
[4]
Vishnu Vaman Shirwadkar(Kusumagraj)
For Marathi Literature
1987
[5]
Wallace Stegner
Angle of Repose
1971
[1]
Willa Cather
One of Ours
1922
[1]
William Faulkner
A Fable / The Reivers
1954/1962
[1]
William Golding
Rites of Passage
1980
[3]
William Maxwell
So Long, See You Tomorrow
1981
[1]
Yan Lianke
The Four Books
2016
[4]
Yann Martel
The Life Of Pi
Not in source
[3]
Yiyun Li
Wednesday's Child
2024
[1]`;

const dataPath = './data/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const awardMap = {
    '[1]': 'Pulitzer Prize',
    '[2]': 'Sahitya Akademi Award',
    '[3]': 'Booker Prize',
    '[4]': 'International Booker Prize',
    '[5]': 'Jnanpith Award'
};

const lines = rawData.split('\n');
const entries = [];
for (let i = 0; i < lines.length; i += 4) {
    if (lines[i] && lines[i+1] && lines[i+2] && lines[i+3]) {
        entries.push({
            author: lines[i].trim(),
            work: lines[i+1].trim(),
            year: lines[i+2].trim(),
            source: lines[i+3].trim()
        });
    }
}

function normalize(s) {
    return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

let updateCount = 0;
for (const entry of entries) {
    const authorName = entry.author;
    const workTitle = entry.work;
    const awardName = awardMap[entry.source] || 'Literary Award';
    const year = entry.year;

    let foundAuthor = false;
    for (const cat in data) {
        for (const authorObj of data[cat]) {
            if (normalize(authorObj.author) === normalize(authorName)) {
                foundAuthor = true;
                
                // 1. Add award to legacy
                if (!authorObj.legacy) authorObj.legacy = {};
                if (!authorObj.legacy.awards) authorObj.legacy.awards = [];
                if (!Array.isArray(authorObj.legacy.awards)) authorObj.legacy.awards = [authorObj.legacy.awards];
                
                const awardStr = `${awardName} (${year})`;
                if (!authorObj.legacy.awards.includes(awardStr)) {
                    authorObj.legacy.awards.push(awardStr);
                }

                // 2. Add/Update work
                if (!authorObj.works) authorObj.works = [];
                let existingWork = authorObj.works.find(w => {
                    const title = (typeof w === 'string') ? w : (w.title || '');
                    return normalize(title) === normalize(workTitle);
                });

                if (existingWork) {
                    if (typeof existingWork === 'string') {
                        // Convert to object to add metadata
                        const index = authorObj.works.indexOf(existingWork);
                        authorObj.works[index] = {
                            title: existingWork,
                            award: awardName,
                            award_year: year
                        };
                    } else {
                        existingWork.award = awardName;
                        existingWork.award_year = year;
                    }
                } else {
                    // Work doesn't exist, add it
                    authorObj.works.push({
                        title: workTitle,
                        award: awardName,
                        award_year: year
                    });
                }
                updateCount++;
            }
        }
    }
}

console.log(`Updated ${updateCount} entries.`);
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
