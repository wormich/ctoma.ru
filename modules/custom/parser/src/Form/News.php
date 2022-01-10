<?php

namespace Drupal\parser\Form;

use DOMDocument;
use DOMXPath;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

/**
 * Configure example settings for this site.
 */
class News extends FormBase {

  private $batch;

  //второй обход по страницам
  private $batch_two;

  //массив отзывов
  private $review;
  //делаем url + оригинальный html

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_news';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Start parser news ||'),
      '#button_type' => 'primary',
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $this->batch = [
      'title' => "Rewiew parser",
      'finished' => [$this, 'finished'],
      'file' => drupal_get_path('module', 'parser') . '/src/News.php',
    ];

    for ($i = 1; $i <= 8; $i++) {
      $this->batch['operations'][] = [
        [$this, 'parse'],
        array("http://www.ctoma.ru/news/?page_11=" . $i)
      ];
    }

    batch_set($this->batch);
  }

  /**
   * {@inheritdoc}
   */
  public function parse($url, &$context) {
    $doc = new DOMDocument();
    $doc->loadHTMLFile($url);
    $xpath = new DOMXPath($doc);
    $result = [];
    //получаем весь список ссылок

    $reply = $xpath->query("//*[contains(@class, 'center')]//*[contains(@class, 'reply')]");

    for ($i = $reply->length - 1; $i > -1; $i--) {

      $original_url = '';

      $reply_html = $doc->saveHTML($reply->item($i));
      $reply_doc = new DOMDocument();
      $reply_doc->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' . $reply_html);
      $reply_xp = new DOMXPath($reply_doc);

      $link = $reply_xp->query("//a/@href");
      for ($j = $link->length - 1; $j > -1; $j--) {
        if (strstr($link->item($j)->nodeValue, '/news/post/')) {
          $original_url = $link->item($j)->nodeValue;
        }
      }

      $img = $reply_xp->query("//img/@src");
      $img = $img->item($img->length - 1)->nodeValue;

      $img_ = $img;
      $img = str_replace("/img.php?", "", $img);
      $img = str_replace("image=http://ctoma.ru/", "", $img);
      $img = str_replace("image=http://www.ctoma.ru/", "", $img);
      $img = str_replace("width=100", "", $img);
      $img = str_replace("width=150", "", $img);
      $img = str_replace("width=500", "", $img);
      $img = str_replace("height=250", "", $img);
      $img = str_replace("height=500", "", $img);
      $img = str_replace("&", "", $img);


      if($img){
        $this->createNode($original_url, $img);
      }
    }

  }

  /**
   * {@inheritdoc}
   */
  public function finished($success, $results, $operations) {
    drupal_set_message("ОК");
  }

  /**
   * {@inheritdoc}
   * Функция для создания нод типа отзывы
   */
  public function createNode($original_url, $img) {
    $full_img_url = "http://www.ctoma.ru/" . $img;
    $img = str_replace("/", "_", $img);
    $data = file_get_contents($full_img_url);
    $file = file_save_data($data, 'public://parser/news/' . $img, FILE_EXISTS_REPLACE);

    if($file){
      $node = Node::create([
        'type' => 'news',
        'title' => 'Новость',
        'field_originalnyi_url' => $original_url,
        'field_izobrazenie_statei' => [
          'target_id' => $file->id(),
        ],
        'path' => ['alias' => substr($original_url, 0, -1)],
      ]);
      $node->save();
    }
  }


}