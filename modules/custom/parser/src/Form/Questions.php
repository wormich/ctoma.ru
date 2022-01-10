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

class Questions extends FormBase {

  private $batch;

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_questions';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Start parser |||'),
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
      'file' => drupal_get_path('module', 'parser') . '/src/Questions.php',
    ];

    for( $i= 1 ; $i <= 10 ; $i++ ){
      $this->batch['operations'][] = [
        [$this, 'parse'],
        array("http://www.ctoma.ru/questions/?page_12=".$i)
      ];
    }

    batch_set($this->batch);
  }

  /**
   * {@inheritdoc}
   */
  public function parse($url_, &$context) {
    $doc = new DOMDocument();
    $doc->loadHTMLFile($url_);
    $xpath = new DOMXPath($doc);

    $sourse_url = $url_;

    $reply = $xpath->query("//*[contains(@class, 'reply')]");

    for ($i = $reply->length - 1; $i > -1; $i--) {

      $original_url = '';

      $reply_html = $doc->saveHTML($reply->item($i));
      $reply_doc = new DOMDocument();
      $reply_doc->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'.$reply_html);
      $reply_xp = new DOMXPath($reply_doc);

      $link = $reply_xp->query("//a/@href");
      for ($j = $link->length - 1; $j > -1; $j--) {
        if(strstr($link->item($j)->nodeValue, 'questions/show/')){
          $original_url = $link->item($j)->nodeValue;
        }
      }

      $d = $reply_xp->query("//p");
      $date = $d->item($d->length - 1)->nodeValue;

      $this->createNode($original_url,$sourse_url, $date);
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
  public function createNode($original_url, $sourse_url, $date) {

    $node = Node::create([
      'type'        => 'questions',
      'title'       => 'Вопрос-Ответ',
      'field_original_html' => $sourse_url,
      'field_originalnyi_url' => $original_url,
      'field_original_date' => $date,
      'path' => ['alias' => mb_strimwidth(substr($original_url, 0, -1), 0, 255, "")],
    ]);
    $node->save();

  }


}